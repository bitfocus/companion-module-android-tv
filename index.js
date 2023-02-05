const instance_skel = require('../../instance_skel')
let AndroidRemote, RemoteKeyCode, RemoteDirection

const wol = require('wake_on_lan')
const macfromip = require('macfromip')
const bonjour = require('bonjour')()

class instance extends instance_skel {
	/**
	 * Create an instance of the module
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config)

		this.CHOICES_DEVICES = []

		this.actions() // export actions
		this.init_presets() // export presets
	}

	updateConfig(config) {
		this.init_presets()

		this.config = config

		this.init_tv_connection()

		this.init_variables()
		this.init_feedbacks()
	}

	init() {
		this.init_tv_connection()

		this.init_variables()
		this.init_feedbacks()
		this.init_presets()
	}

	init_tv_connection() {
		this.status(this.STATUS_UNKNOWN)

		if (this.config.host) {
			// this.status(this.STATE_WARNING, 'Connecting')
			import('androidtv-remote').then((AndroidTV) => {
				console.log('--Starting AndroidTV-Remote--')
				AndroidRemote = AndroidTV.AndroidRemote
				RemoteKeyCode = AndroidTV.RemoteKeyCode
				RemoteDirection = AndroidTV.RemoteDirection

				let options = {
					pairing_port: 6467,
					remote_port: 6466,
					name: 'companion-androidtv-remote',
					cert: {}
				}

				if (this.config.certificate !== undefined && this.config.certificate.key !== undefined) {
					options.cert = this.config.certificate
				}

				if (!this.config.certBool) {
					options.cert = {}
				}

				console.log('--Creating tv interface--')
				this.tv = new AndroidRemote(this.config.host, options)
				this.tv.state = {}
				const theTV = this.tv

				console.log('--Setting Variables--')
				this.tv.on('powered', (powered) => {
					// console.debug('Powered : ' + powered)
					this.setVariable('power_state', powered)
					theTV.state.power = powered
					this.checkFeedbacks('power_state')
				})

				this.tv.on('volume', (volume) => {
					this.setVariable('volume_level', volume.level)
					this.setVariable('volume_max', volume.maximum)
					this.setVariable('volume_muted', volume.muted)
					theTV.state.volume = volume
					this.checkFeedbacks()
					// console.debug('Volume : ' + volume.level + '/' + volume.maximum + ' | Muted : ' + volume.muted)
				})

				this.tv.on('current_app', (current_app) => {
					this.setVariable('current_app_state', current_app)
					// console.debug('Current App : ' + current_app)
					theTV.state.currentApp = current_app
					this.checkFeedbacks('current_app')
				})

				this.tv.on('error', (error) => {
					console.error('There was an Error!!!')
					this.status(this.STATE_ERROR, error)
					this.log('error', 'Network error: ' + error.message)
				})

				this.tv.on('unpaired', () => {
					console.error('Unpaired')
					this.status(this.STATE_ERROR, 'Unpaired')
					this.log('error', 'Unpaired error')
					this.config.certBool = false
					this.saveConfig()
				})

				this.tv.on('ready', async () => {
					await new Promise((resolve) => setTimeout(resolve, 2000))

					if (!this.config.macAddress || this.config.macAddress === '') {
						try {
							const host = this.config.host

							this.config.macAddress = await new Promise(function(resolve, reject) {
								macfromip.getMac(host, function(err, data) {
									if (err) {
										reject(err)
									}
									resolve(data)
								})
							})
						} catch (e) {
							console.error(e)
							this.debug('Error Getting Mac Address: You might have to enter it manually.', error)
							this.config.macAddress === ''
						}
					}

					this.config.certificate = this.tv.getCertificate()
					this.config.certBool = true

					this.status(this.STATUS_OK)
					this.saveConfig()
				})

				if (this.config.certificate !== undefined && this.config.certificate.key !== undefined) {
					// console.log('--Starting TV--');
					this.tv.start()
				}
			})
		} else {
			this.searchForTVs()
		}
	}

	// Return config fields for web config
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: `
				This module will connect to most new AndroidTVs. Click on the question mark for pairing instructions.
			`
			},
			{
				type: 'dropdown',
				id: 'host',
				label: 'Target IP',
				width: 6,
				choices: this.CHOICES_DEVICES,
				default: '',
				allowCustom: true,
				regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'macAddress',
				label: 'Target Mac Address (automatically found)',
				width: 6,
				default: '',
				regex: '/^([0-9a-f]{2}([:.-]{0,1}|$)){6}$/i'
			},
			{
				type: 'checkbox',
				label: 'Paired',
				id: 'certBool',
				default: false,
				tooltip: 'Uncheck and hit save button to clear saved credentials.'
			}
		]
	}

	searchForTVs() {
		let self = this
		return new Promise((resolve, reject) => {
			const port = 6466
			const serviceType = `androidtvremote2`

			try {
				self.log('info', 'Searching for Devices.')
			} catch (e) {
				console.log("Logging isn't working!", e)
			}

			const browser = bonjour.find({ type: serviceType }, function(service) {
				self.CHOICES_DEVICES.push({
					id: service.addresses[0],
					label: `${service.name} - ${service.addresses[0]}`
				})
			})
			// Search for tvs again just in case
			setTimeout(() => {
				browser.update()
				self.log('info', 'Searching for Devices a second time.')

				setTimeout(() => {
					browser.stop()
					bonjour.destroy()
					self.log('info', 'Searching for Devices a third time.')
					resolve()
				}, 10000)
				resolve()
			}, 10000)
		})
	}

	// When the module gets deleted or disabled
	destroy() {
		if (this.tv !== undefined) {
			this.tv.remoteManager.client.destroy()
			this.tv.stop()
			this.tv = undefined
		}

		this.debug('destroy', this.id)
	}

	init_presets() {
		let presets = []
		this.setPresetDefinitions(presets)
	}

	actions() {
		// this.setupVolume()

		this.setActions({
			pair: {
				label: 'Pair device'
			},
			pin: {
				label: 'Enter pin',
				options: [
					{
						type: 'textinput',
						label: 'Enter the pin as displayed on the TV',
						id: 'pin'
						// regex: self.REGEX_NUMBER
					}
				]
			},
			power: {
				label: 'Set Power state',
				options: [
					{
						type: 'dropdown',
						label: 'on/off',
						id: 'power',
						default: 'power_on',
						choices: [{ label: 'power on', id: 'power_on' }, { label: 'power off', id: 'power_off' }]
					}
				]
			},
			mute: {
				label: 'Set Mute state',
				options: [
					{
						type: 'dropdown',
						label: 'on/off',
						id: 'mute',
						default: 'mute_off',
						choices: [{ label: 'Mute On', id: 'mute_on' }, { label: 'Mute Off', id: 'mute_off' }]
					}
				]
			},
			app_link: {
				label: 'Send App Link',
				options: [
					{
						type: 'textinput',
						label: 'Link',
						id: 'app_link',
						default: '',
						tooltip: 'ex. https://www.netflix.com/title/80057281'
					}
				]
			},
			// changeVolume: {
			// 	label: 'Change Volume',
			// 	options: [
			// 		{
			// 			type: 'dropdown',
			// 			label: 'up/down',
			// 			id: 'change_volume',
			// 			default: 'volume_down',
			// 			choices: [{ label: 'Volume Up', id: 'volume_up' }, { label: 'Volume Down', id: 'volume_down' }]
			// 		}
			// 	]
			// },
			button: {
				label: 'Send Button Command',
				options: [
					{
						type: 'dropdown',
						label: 'Select Button',
						id: 'button',
						default: 'KEYCODE_SOFT_LEFT',
						choices: [
							{ label: 'KEYCODE_SOFT_LEFT', id: 'KEYCODE_SOFT_LEFT' },
							{ label: 'KEYCODE_SOFT_RIGHT', id: 'KEYCODE_SOFT_RIGHT' },
							{ label: 'KEYCODE_HOME', id: 'KEYCODE_HOME' },
							{ label: 'KEYCODE_BACK', id: 'KEYCODE_BACK' },
							{ label: 'KEYCODE_CALL', id: 'KEYCODE_CALL' },
							{ label: 'KEYCODE_ENDCALL', id: 'KEYCODE_ENDCALL' },
							{ label: 'KEYCODE_0', id: 'KEYCODE_0' },
							{ label: 'KEYCODE_1', id: 'KEYCODE_1' },
							{ label: 'KEYCODE_2', id: 'KEYCODE_2' },
							{ label: 'KEYCODE_3', id: 'KEYCODE_3' },
							{ label: 'KEYCODE_4', id: 'KEYCODE_4' },
							{ label: 'KEYCODE_5', id: 'KEYCODE_5' },
							{ label: 'KEYCODE_6', id: 'KEYCODE_6' },
							{ label: 'KEYCODE_7', id: 'KEYCODE_7' },
							{ label: 'KEYCODE_8', id: 'KEYCODE_8' },
							{ label: 'KEYCODE_9', id: 'KEYCODE_9' },
							{ label: 'KEYCODE_STAR', id: 'KEYCODE_STAR' },
							{ label: 'KEYCODE_POUND', id: 'KEYCODE_POUND' },
							{ label: 'KEYCODE_DPAD_UP', id: 'KEYCODE_DPAD_UP' },
							{ label: 'KEYCODE_DPAD_DOWN', id: 'KEYCODE_DPAD_DOWN' },
							{ label: 'KEYCODE_DPAD_LEFT', id: 'KEYCODE_DPAD_LEFT' },
							{ label: 'KEYCODE_DPAD_RIGHT', id: 'KEYCODE_DPAD_RIGHT' },
							{ label: 'KEYCODE_DPAD_CENTER', id: 'KEYCODE_DPAD_CENTER' },
							{ label: 'KEYCODE_VOLUME_UP', id: 'KEYCODE_VOLUME_UP' },
							{ label: 'KEYCODE_VOLUME_DOWN', id: 'KEYCODE_VOLUME_DOWN' },
							{ label: 'KEYCODE_POWER', id: 'KEYCODE_POWER' },
							{ label: 'KEYCODE_CAMERA', id: 'KEYCODE_CAMERA' },
							{ label: 'KEYCODE_CLEAR', id: 'KEYCODE_CLEAR' },
							{ label: 'KEYCODE_A', id: 'KEYCODE_A' },
							{ label: 'KEYCODE_B', id: 'KEYCODE_B' },
							{ label: 'KEYCODE_C', id: 'KEYCODE_C' },
							{ label: 'KEYCODE_D', id: 'KEYCODE_D' },
							{ label: 'KEYCODE_E', id: 'KEYCODE_E' },
							{ label: 'KEYCODE_F', id: 'KEYCODE_F' },
							{ label: 'KEYCODE_G', id: 'KEYCODE_G' },
							{ label: 'KEYCODE_H', id: 'KEYCODE_H' },
							{ label: 'KEYCODE_I', id: 'KEYCODE_I' },
							{ label: 'KEYCODE_J', id: 'KEYCODE_J' },
							{ label: 'KEYCODE_K', id: 'KEYCODE_K' },
							{ label: 'KEYCODE_L', id: 'KEYCODE_L' },
							{ label: 'KEYCODE_M', id: 'KEYCODE_M' },
							{ label: 'KEYCODE_N', id: 'KEYCODE_N' },
							{ label: 'KEYCODE_O', id: 'KEYCODE_O' },
							{ label: 'KEYCODE_P', id: 'KEYCODE_P' },
							{ label: 'KEYCODE_Q', id: 'KEYCODE_Q' },
							{ label: 'KEYCODE_R', id: 'KEYCODE_R' },
							{ label: 'KEYCODE_S', id: 'KEYCODE_S' },
							{ label: 'KEYCODE_T', id: 'KEYCODE_T' },
							{ label: 'KEYCODE_U', id: 'KEYCODE_U' },
							{ label: 'KEYCODE_V', id: 'KEYCODE_V' },
							{ label: 'KEYCODE_W', id: 'KEYCODE_W' },
							{ label: 'KEYCODE_X', id: 'KEYCODE_X' },
							{ label: 'KEYCODE_Y', id: 'KEYCODE_Y' },
							{ label: 'KEYCODE_Z', id: 'KEYCODE_Z' },
							{ label: 'KEYCODE_COMMA', id: 'KEYCODE_COMMA' },
							{ label: 'KEYCODE_PERIOD', id: 'KEYCODE_PERIOD' },
							{ label: 'KEYCODE_ALT_LEFT', id: 'KEYCODE_ALT_LEFT' },
							{ label: 'KEYCODE_ALT_RIGHT', id: 'KEYCODE_ALT_RIGHT' },
							{ label: 'KEYCODE_SHIFT_LEFT', id: 'KEYCODE_SHIFT_LEFT' },
							{ label: 'KEYCODE_SHIFT_RIGHT', id: 'KEYCODE_SHIFT_RIGHT' },
							{ label: 'KEYCODE_TAB', id: 'KEYCODE_TAB' },
							{ label: 'KEYCODE_SPACE', id: 'KEYCODE_SPACE' },
							{ label: 'KEYCODE_SYM', id: 'KEYCODE_SYM' },
							{ label: 'KEYCODE_EXPLORER', id: 'KEYCODE_EXPLORER' },
							{ label: 'KEYCODE_ENVELOPE', id: 'KEYCODE_ENVELOPE' },
							{ label: 'KEYCODE_ENTER', id: 'KEYCODE_ENTER' },
							{ label: 'KEYCODE_DEL', id: 'KEYCODE_DEL' },
							{ label: 'KEYCODE_GRAVE', id: 'KEYCODE_GRAVE' },
							{ label: 'KEYCODE_MINUS', id: 'KEYCODE_MINUS' },
							{ label: 'KEYCODE_EQUALS', id: 'KEYCODE_EQUALS' },
							{ label: 'KEYCODE_LEFT_BRACKET', id: 'KEYCODE_LEFT_BRACKET' },
							{ label: 'KEYCODE_RIGHT_BRACKET', id: 'KEYCODE_RIGHT_BRACKET' },
							{ label: 'KEYCODE_BACKSLASH', id: 'KEYCODE_BACKSLASH' },
							{ label: 'KEYCODE_SEMICOLON', id: 'KEYCODE_SEMICOLON' },
							{ label: 'KEYCODE_APOSTROPHE', id: 'KEYCODE_APOSTROPHE' },
							{ label: 'KEYCODE_SLASH', id: 'KEYCODE_SLASH' },
							{ label: 'KEYCODE_AT', id: 'KEYCODE_AT' },
							{ label: 'KEYCODE_NUM', id: 'KEYCODE_NUM' },
							{ label: 'KEYCODE_HEADSETHOOK', id: 'KEYCODE_HEADSETHOOK' },
							{ label: 'KEYCODE_FOCUS', id: 'KEYCODE_FOCUS' },
							{ label: 'KEYCODE_PLUS', id: 'KEYCODE_PLUS' },
							{ label: 'KEYCODE_MENU', id: 'KEYCODE_MENU' },
							{ label: 'KEYCODE_NOTIFICATION', id: 'KEYCODE_NOTIFICATION' },
							{ label: 'KEYCODE_SEARCH', id: 'KEYCODE_SEARCH' },
							{ label: 'KEYCODE_MEDIA_PLAY_PAUSE=', id: 'KEYCODE_MEDIA_PLAY_PAUSE=' },
							{ label: 'KEYCODE_MEDIA_STOP', id: 'KEYCODE_MEDIA_STOP' },
							{ label: 'KEYCODE_MEDIA_NEXT', id: 'KEYCODE_MEDIA_NEXT' },
							{ label: 'KEYCODE_MEDIA_PREVIOUS', id: 'KEYCODE_MEDIA_PREVIOUS' },
							{ label: 'KEYCODE_MEDIA_REWIND', id: 'KEYCODE_MEDIA_REWIND' },
							{ label: 'KEYCODE_MEDIA_FAST_FORWARD', id: 'KEYCODE_MEDIA_FAST_FORWARD' },
							{ label: 'KEYCODE_MUTE', id: 'KEYCODE_MUTE' },
							{ label: 'KEYCODE_PAGE_UP', id: 'KEYCODE_PAGE_UP' },
							{ label: 'KEYCODE_PAGE_DOWN', id: 'KEYCODE_PAGE_DOWN' },
							{ label: 'KEYCODE_PICTSYMBOLS', id: 'KEYCODE_PICTSYMBOLS' },
							{ label: 'KEYCODE_SWITCH_CHARSET', id: 'KEYCODE_SWITCH_CHARSET' },
							{ label: 'KEYCODE_BUTTON_A', id: 'KEYCODE_BUTTON_A' },
							{ label: 'KEYCODE_BUTTON_B', id: 'KEYCODE_BUTTON_B' },
							{ label: 'KEYCODE_BUTTON_C', id: 'KEYCODE_BUTTON_C' },
							{ label: 'KEYCODE_BUTTON_X', id: 'KEYCODE_BUTTON_X' },
							{ label: 'KEYCODE_BUTTON_Y', id: 'KEYCODE_BUTTON_Y' },
							{ label: 'KEYCODE_BUTTON_Z', id: 'KEYCODE_BUTTON_Z' },
							{ label: 'KEYCODE_BUTTON_L1', id: 'KEYCODE_BUTTON_L1' },
							{ label: 'KEYCODE_BUTTON_R1', id: 'KEYCODE_BUTTON_R1' },
							{ label: 'KEYCODE_BUTTON_L2', id: 'KEYCODE_BUTTON_L2' },
							{ label: 'KEYCODE_BUTTON_R2', id: 'KEYCODE_BUTTON_R2' },
							{ label: 'KEYCODE_BUTTON_THUMBL', id: 'KEYCODE_BUTTON_THUMBL' },
							{ label: 'KEYCODE_BUTTON_THUMBR', id: 'KEYCODE_BUTTON_THUMBR' },
							{ label: 'KEYCODE_BUTTON_START', id: 'KEYCODE_BUTTON_START' },
							{ label: 'KEYCODE_BUTTON_SELECT', id: 'KEYCODE_BUTTON_SELECT' },
							{ label: 'KEYCODE_BUTTON_MODE', id: 'KEYCODE_BUTTON_MODE' },
							{ label: 'KEYCODE_ESCAPE', id: 'KEYCODE_ESCAPE' },
							{ label: 'KEYCODE_FORWARD_DEL', id: 'KEYCODE_FORWARD_DEL' },
							{ label: 'KEYCODE_CTRL_LEFT', id: 'KEYCODE_CTRL_LEFT' },
							{ label: 'KEYCODE_CTRL_RIGHT', id: 'KEYCODE_CTRL_RIGHT' },
							{ label: 'KEYCODE_CAPS_LOCK', id: 'KEYCODE_CAPS_LOCK' },
							{ label: 'KEYCODE_SCROLL_LOCK', id: 'KEYCODE_SCROLL_LOCK' },
							{ label: 'KEYCODE_META_LEFT', id: 'KEYCODE_META_LEFT' },
							{ label: 'KEYCODE_META_RIGHT', id: 'KEYCODE_META_RIGHT' },
							{ label: 'KEYCODE_FUNCTION', id: 'KEYCODE_FUNCTION' },
							{ label: 'KEYCODE_SYSRQ', id: 'KEYCODE_SYSRQ' },
							{ label: 'KEYCODE_BREAK', id: 'KEYCODE_BREAK' },
							{ label: 'KEYCODE_MOVE_HOME', id: 'KEYCODE_MOVE_HOME' },
							{ label: 'KEYCODE_MOVE_END', id: 'KEYCODE_MOVE_END' },
							{ label: 'KEYCODE_INSERT', id: 'KEYCODE_INSERT' },
							{ label: 'KEYCODE_FORWARD', id: 'KEYCODE_FORWARD' },
							{ label: 'KEYCODE_MEDIA_PLAY', id: 'KEYCODE_MEDIA_PLAY' },
							{ label: 'KEYCODE_MEDIA_PAUSE', id: 'KEYCODE_MEDIA_PAUSE' },
							{ label: 'KEYCODE_MEDIA_CLOSE', id: 'KEYCODE_MEDIA_CLOSE' },
							{ label: 'KEYCODE_MEDIA_EJECT', id: 'KEYCODE_MEDIA_EJECT' },
							{ label: 'KEYCODE_MEDIA_RECORD', id: 'KEYCODE_MEDIA_RECORD' },
							{ label: 'KEYCODE_F1', id: 'KEYCODE_F1' },
							{ label: 'KEYCODE_F2', id: 'KEYCODE_F2' },
							{ label: 'KEYCODE_F3', id: 'KEYCODE_F3' },
							{ label: 'KEYCODE_F4', id: 'KEYCODE_F4' },
							{ label: 'KEYCODE_F5', id: 'KEYCODE_F5' },
							{ label: 'KEYCODE_F6', id: 'KEYCODE_F6' },
							{ label: 'KEYCODE_F7', id: 'KEYCODE_F7' },
							{ label: 'KEYCODE_F8', id: 'KEYCODE_F8' },
							{ label: 'KEYCODE_F9', id: 'KEYCODE_F9' },
							{ label: 'KEYCODE_F10', id: 'KEYCODE_F10' },
							{ label: 'KEYCODE_F11', id: 'KEYCODE_F11' },
							{ label: 'KEYCODE_F12', id: 'KEYCODE_F12' },
							{ label: 'KEYCODE_NUM_LOCK', id: 'KEYCODE_NUM_LOCK' },
							{ label: 'KEYCODE_NUMPAD_0', id: 'KEYCODE_NUMPAD_0' },
							{ label: 'KEYCODE_NUMPAD_1', id: 'KEYCODE_NUMPAD_1' },
							{ label: 'KEYCODE_NUMPAD_2', id: 'KEYCODE_NUMPAD_2' },
							{ label: 'KEYCODE_NUMPAD_3', id: 'KEYCODE_NUMPAD_3' },
							{ label: 'KEYCODE_NUMPAD_4', id: 'KEYCODE_NUMPAD_4' },
							{ label: 'KEYCODE_NUMPAD_5', id: 'KEYCODE_NUMPAD_5' },
							{ label: 'KEYCODE_NUMPAD_6', id: 'KEYCODE_NUMPAD_6' },
							{ label: 'KEYCODE_NUMPAD_7', id: 'KEYCODE_NUMPAD_7' },
							{ label: 'KEYCODE_NUMPAD_8', id: 'KEYCODE_NUMPAD_8' },
							{ label: 'KEYCODE_NUMPAD_9', id: 'KEYCODE_NUMPAD_9' },
							{ label: 'KEYCODE_NUMPAD_DIVIDE', id: 'KEYCODE_NUMPAD_DIVIDE' },
							{ label: 'KEYCODE_NUMPAD_MULTIPLY', id: 'KEYCODE_NUMPAD_MULTIPLY' },
							{ label: 'KEYCODE_NUMPAD_SUBTRACT', id: 'KEYCODE_NUMPAD_SUBTRACT' },
							{ label: 'KEYCODE_NUMPAD_ADD', id: 'KEYCODE_NUMPAD_ADD' },
							{ label: 'KEYCODE_NUMPAD_DOT', id: 'KEYCODE_NUMPAD_DOT' },
							{ label: 'KEYCODE_NUMPAD_COMMA', id: 'KEYCODE_NUMPAD_COMMA' },
							{ label: 'KEYCODE_NUMPAD_ENTER', id: 'KEYCODE_NUMPAD_ENTER' },
							{ label: 'KEYCODE_NUMPAD_EQUALS', id: 'KEYCODE_NUMPAD_EQUALS' },
							{ label: 'KEYCODE_NUMPAD_LEFT_PAREN', id: 'KEYCODE_NUMPAD_LEFT_PAREN' },
							{ label: 'KEYCODE_NUMPAD_RIGHT_PAREN', id: 'KEYCODE_NUMPAD_RIGHT_PAREN' },
							{ label: 'KEYCODE_VOLUME_MUTE', id: 'KEYCODE_VOLUME_MUTE' },
							{ label: 'KEYCODE_INFO', id: 'KEYCODE_INFO' },
							{ label: 'KEYCODE_CHANNEL_UP', id: 'KEYCODE_CHANNEL_UP' },
							{ label: 'KEYCODE_CHANNEL_DOWN', id: 'KEYCODE_CHANNEL_DOWN' },
							{ label: 'KEYCODE_ZOOM_IN', id: 'KEYCODE_ZOOM_IN' },
							{ label: 'KEYCODE_ZOOM_OUT', id: 'KEYCODE_ZOOM_OUT' },
							{ label: 'KEYCODE_TV', id: 'KEYCODE_TV' },
							{ label: 'KEYCODE_WINDOW', id: 'KEYCODE_WINDOW' },
							{ label: 'KEYCODE_GUIDE', id: 'KEYCODE_GUIDE' },
							{ label: 'KEYCODE_DVR', id: 'KEYCODE_DVR' },
							{ label: 'KEYCODE_BOOKMARK', id: 'KEYCODE_BOOKMARK' },
							{ label: 'KEYCODE_CAPTIONS', id: 'KEYCODE_CAPTIONS' },
							{ label: 'KEYCODE_SETTINGS', id: 'KEYCODE_SETTINGS' },
							{ label: 'KEYCODE_TV_POWER', id: 'KEYCODE_TV_POWER' },
							{ label: 'KEYCODE_TV_INPUT', id: 'KEYCODE_TV_INPUT' },
							{ label: 'KEYCODE_STB_POWER', id: 'KEYCODE_STB_POWER' },
							{ label: 'KEYCODE_STB_INPUT', id: 'KEYCODE_STB_INPUT' },
							{ label: 'KEYCODE_AVR_POWER', id: 'KEYCODE_AVR_POWER' },
							{ label: 'KEYCODE_AVR_INPUT', id: 'KEYCODE_AVR_INPUT' },
							{ label: 'KEYCODE_PROG_RED', id: 'KEYCODE_PROG_RED' },
							{ label: 'KEYCODE_PROG_GREEN', id: 'KEYCODE_PROG_GREEN' },
							{ label: 'KEYCODE_PROG_YELLOW', id: 'KEYCODE_PROG_YELLOW' },
							{ label: 'KEYCODE_PROG_BLUE', id: 'KEYCODE_PROG_BLUE' },
							{ label: 'KEYCODE_APP_SWITCH', id: 'KEYCODE_APP_SWITCH' },
							{ label: 'KEYCODE_BUTTON_1', id: 'KEYCODE_BUTTON_1' },
							{ label: 'KEYCODE_BUTTON_2', id: 'KEYCODE_BUTTON_2' },
							{ label: 'KEYCODE_BUTTON_3', id: 'KEYCODE_BUTTON_3' },
							{ label: 'KEYCODE_BUTTON_4', id: 'KEYCODE_BUTTON_4' },
							{ label: 'KEYCODE_BUTTON_5', id: 'KEYCODE_BUTTON_5' },
							{ label: 'KEYCODE_BUTTON_6', id: 'KEYCODE_BUTTON_6' },
							{ label: 'KEYCODE_BUTTON_7', id: 'KEYCODE_BUTTON_7' },
							{ label: 'KEYCODE_BUTTON_8', id: 'KEYCODE_BUTTON_8' },
							{ label: 'KEYCODE_BUTTON_9', id: 'KEYCODE_BUTTON_9' },
							{ label: 'KEYCODE_BUTTON_10', id: 'KEYCODE_BUTTON_10' },
							{ label: 'KEYCODE_BUTTON_11', id: 'KEYCODE_BUTTON_11' },
							{ label: 'KEYCODE_BUTTON_12', id: 'KEYCODE_BUTTON_12' },
							{ label: 'KEYCODE_BUTTON_13', id: 'KEYCODE_BUTTON_13' },
							{ label: 'KEYCODE_BUTTON_14', id: 'KEYCODE_BUTTON_14' },
							{ label: 'KEYCODE_BUTTON_15', id: 'KEYCODE_BUTTON_15' },
							{ label: 'KEYCODE_BUTTON_16', id: 'KEYCODE_BUTTON_16' },
							{ label: 'KEYCODE_LANGUAGE_SWITCH', id: 'KEYCODE_LANGUAGE_SWITCH' },
							{ label: 'KEYCODE_MANNER_MODE', id: 'KEYCODE_MANNER_MODE' },
							{ label: 'KEYCODE_3D_MODE', id: 'KEYCODE_3D_MODE' },
							{ label: 'KEYCODE_CONTACTS', id: 'KEYCODE_CONTACTS' },
							{ label: 'KEYCODE_CALENDAR', id: 'KEYCODE_CALENDAR' },
							{ label: 'KEYCODE_MUSIC', id: 'KEYCODE_MUSIC' },
							{ label: 'KEYCODE_CALCULATOR', id: 'KEYCODE_CALCULATOR' },
							{ label: 'KEYCODE_ZENKAKU_HANKAKU', id: 'KEYCODE_ZENKAKU_HANKAKU' },
							{ label: 'KEYCODE_EISU', id: 'KEYCODE_EISU' },
							{ label: 'KEYCODE_MUHENKAN', id: 'KEYCODE_MUHENKAN' },
							{ label: 'KEYCODE_HENKAN', id: 'KEYCODE_HENKAN' },
							{ label: 'KEYCODE_KATAKANA_HIRAGANA', id: 'KEYCODE_KATAKANA_HIRAGANA' },
							{ label: 'KEYCODE_YEN', id: 'KEYCODE_YEN' },
							{ label: 'KEYCODE_RO', id: 'KEYCODE_RO' },
							{ label: 'KEYCODE_KANA', id: 'KEYCODE_KANA' },
							{ label: 'KEYCODE_ASSIST', id: 'KEYCODE_ASSIST' },
							{ label: 'KEYCODE_BRIGHTNESS_DOWN', id: 'KEYCODE_BRIGHTNESS_DOWN' },
							{ label: 'KEYCODE_BRIGHTNESS_UP', id: 'KEYCODE_BRIGHTNESS_UP' },
							{ label: 'KEYCODE_MEDIA_AUDIO_TRACK', id: 'KEYCODE_MEDIA_AUDIO_TRACK' },
							{ label: 'KEYCODE_SLEEP', id: 'KEYCODE_SLEEP' },
							{ label: 'KEYCODE_WAKEUP', id: 'KEYCODE_WAKEUP' },
							{ label: 'KEYCODE_PAIRING', id: 'KEYCODE_PAIRING' },
							{ label: 'KEYCODE_MEDIA_TOP_MENU', id: 'KEYCODE_MEDIA_TOP_MENU' },
							{ label: 'KEYCODE_11', id: 'KEYCODE_11' },
							{ label: 'KEYCODE_12', id: 'KEYCODE_12' },
							{ label: 'KEYCODE_LAST_CHANNEL', id: 'KEYCODE_LAST_CHANNEL' },
							{ label: 'KEYCODE_TV_DATA_SERVICE', id: 'KEYCODE_TV_DATA_SERVICE' },
							{ label: 'KEYCODE_VOICE_ASSIST', id: 'KEYCODE_VOICE_ASSIST' },
							{ label: 'KEYCODE_TV_RADIO_SERVICE', id: 'KEYCODE_TV_RADIO_SERVICE' },
							{ label: 'KEYCODE_TV_TELETEXT', id: 'KEYCODE_TV_TELETEXT' },
							{ label: 'KEYCODE_TV_NUMBER_ENTRY', id: 'KEYCODE_TV_NUMBER_ENTRY' },
							{ label: 'KEYCODE_TV_TERRESTRIAL_ANALOG', id: 'KEYCODE_TV_TERRESTRIAL_ANALOG' },
							{ label: 'KEYCODE_TV_TERRESTRIAL_DIGITAL', id: 'KEYCODE_TV_TERRESTRIAL_DIGITAL' },
							{ label: 'KEYCODE_TV_SATELLITE', id: 'KEYCODE_TV_SATELLITE' },
							{ label: 'KEYCODE_TV_SATELLITE_BS', id: 'KEYCODE_TV_SATELLITE_BS' },
							{ label: 'KEYCODE_TV_SATELLITE_CS', id: 'KEYCODE_TV_SATELLITE_CS' },
							{ label: 'KEYCODE_TV_SATELLITE_SERVICE', id: 'KEYCODE_TV_SATELLITE_SERVICE' },
							{ label: 'KEYCODE_TV_NETWORK', id: 'KEYCODE_TV_NETWORK' },
							{ label: 'KEYCODE_TV_ANTENNA_CABLE', id: 'KEYCODE_TV_ANTENNA_CABLE' },
							{ label: 'KEYCODE_TV_INPUT_HDMI_1', id: 'KEYCODE_TV_INPUT_HDMI_1' },
							{ label: 'KEYCODE_TV_INPUT_HDMI_2', id: 'KEYCODE_TV_INPUT_HDMI_2' },
							{ label: 'KEYCODE_TV_INPUT_HDMI_3', id: 'KEYCODE_TV_INPUT_HDMI_3' },
							{ label: 'KEYCODE_TV_INPUT_HDMI_4', id: 'KEYCODE_TV_INPUT_HDMI_4' },
							{ label: 'KEYCODE_TV_INPUT_COMPOSITE_1', id: 'KEYCODE_TV_INPUT_COMPOSITE_1' },
							{ label: 'KEYCODE_TV_INPUT_COMPOSITE_2', id: 'KEYCODE_TV_INPUT_COMPOSITE_2' },
							{ label: 'KEYCODE_TV_INPUT_COMPONENT_1', id: 'KEYCODE_TV_INPUT_COMPONENT_1' },
							{ label: 'KEYCODE_TV_INPUT_COMPONENT_2', id: 'KEYCODE_TV_INPUT_COMPONENT_2' },
							{ label: 'KEYCODE_TV_INPUT_VGA_1', id: 'KEYCODE_TV_INPUT_VGA_1' },
							{ label: 'KEYCODE_TV_AUDIO_DESCRIPTION', id: 'KEYCODE_TV_AUDIO_DESCRIPTION' },
							{ label: 'KEYCODE_TV_AUDIO_DESCRIPTION_MIX_UP', id: 'KEYCODE_TV_AUDIO_DESCRIPTION_MIX_UP' },
							{ label: 'KEYCODE_TV_AUDIO_DESCRIPTION_MIX_DOWN', id: 'KEYCODE_TV_AUDIO_DESCRIPTION_MIX_DOWN' },
							{ label: 'KEYCODE_TV_ZOOM_MODE', id: 'KEYCODE_TV_ZOOM_MODE' },
							{ label: 'KEYCODE_TV_CONTENTS_MENU', id: 'KEYCODE_TV_CONTENTS_MENU' },
							{ label: 'KEYCODE_TV_MEDIA_CONTEXT_MENU', id: 'KEYCODE_TV_MEDIA_CONTEXT_MENU' },
							{ label: 'KEYCODE_TV_TIMER_PROGRAMMING', id: 'KEYCODE_TV_TIMER_PROGRAMMING' },
							{ label: 'KEYCODE_HELP', id: 'KEYCODE_HELP' },
							{ label: 'KEYCODE_NAVIGATE_PREVIOUS', id: 'KEYCODE_NAVIGATE_PREVIOUS' },
							{ label: 'KEYCODE_NAVIGATE_NEXT', id: 'KEYCODE_NAVIGATE_NEXT' },
							{ label: 'KEYCODE_NAVIGATE_IN', id: 'KEYCODE_NAVIGATE_IN' },
							{ label: 'KEYCODE_NAVIGATE_OUT', id: 'KEYCODE_NAVIGATE_OUT' },
							{ label: 'KEYCODE_STEM_PRIMARY', id: 'KEYCODE_STEM_PRIMARY' },
							{ label: 'KEYCODE_STEM_1', id: 'KEYCODE_STEM_1' },
							{ label: 'KEYCODE_STEM_2', id: 'KEYCODE_STEM_2' },
							{ label: 'KEYCODE_STEM_3', id: 'KEYCODE_STEM_3' },
							{ label: 'KEYCODE_DPAD_UP_LEFT', id: 'KEYCODE_DPAD_UP_LEFT' },
							{ label: 'KEYCODE_DPAD_DOWN_LEFT', id: 'KEYCODE_DPAD_DOWN_LEFT' },
							{ label: 'KEYCODE_DPAD_UP_RIGHT', id: 'KEYCODE_DPAD_UP_RIGHT' },
							{ label: 'KEYCODE_DPAD_DOWN_RIGHT', id: 'KEYCODE_DPAD_DOWN_RIGHT' },
							{ label: 'KEYCODE_MEDIA_SKIP_FORWARD', id: 'KEYCODE_MEDIA_SKIP_FORWARD' },
							{ label: 'KEYCODE_MEDIA_SKIP_BACKWARD', id: 'KEYCODE_MEDIA_SKIP_BACKWARD' },
							{ label: 'KEYCODE_MEDIA_STEP_FORWARD', id: 'KEYCODE_MEDIA_STEP_FORWARD' },
							{ label: 'KEYCODE_MEDIA_STEP_BACKWARD', id: 'KEYCODE_MEDIA_STEP_BACKWARD' },
							{ label: 'KEYCODE_SOFT_SLEEP', id: 'KEYCODE_SOFT_SLEEP' },
							{ label: 'KEYCODE_CUT', id: 'KEYCODE_CUT' },
							{ label: 'KEYCODE_COPY', id: 'KEYCODE_COPY' },
							{ label: 'KEYCODE_PASTE', id: 'KEYCODE_PASTE' },
							{ label: 'KEYCODE_SYSTEM_NAVIGATION_UP', id: 'KEYCODE_SYSTEM_NAVIGATION_UP' },
							{ label: 'KEYCODE_SYSTEM_NAVIGATION_DOWN', id: 'KEYCODE_SYSTEM_NAVIGATION_DOWN' },
							{ label: 'KEYCODE_SYSTEM_NAVIGATION_LEFT', id: 'KEYCODE_SYSTEM_NAVIGATION_LEFT' },
							{ label: 'KEYCODE_SYSTEM_NAVIGATION_RIGHT', id: 'KEYCODE_SYSTEM_NAVIGATION_RIGHT' },
							{ label: 'KEYCODE_ALL_APPS', id: 'KEYCODE_ALL_APPS' },
							{ label: 'KEYCODE_REFRESH', id: 'KEYCODE_REFRESH' },
							{ label: 'KEYCODE_THUMBS_UP', id: 'KEYCODE_THUMBS_UP' },
							{ label: 'KEYCODE_THUMBS_DOWN', id: 'KEYCODE_THUMBS_DOWN' },
							{ label: 'KEYCODE_PROFILE_SWITCH', id: 'KEYCODE_PROFILE_SWITCH' },
							{ label: 'KEYCODE_VIDEO_APP_1', id: 'KEYCODE_VIDEO_APP_1' },
							{ label: 'KEYCODE_VIDEO_APP_2', id: 'KEYCODE_VIDEO_APP_2' },
							{ label: 'KEYCODE_VIDEO_APP_3', id: 'KEYCODE_VIDEO_APP_3' },
							{ label: 'KEYCODE_VIDEO_APP_4', id: 'KEYCODE_VIDEO_APP_4' },
							{ label: 'KEYCODE_VIDEO_APP_5', id: 'KEYCODE_VIDEO_APP_5' },
							{ label: 'KEYCODE_VIDEO_APP_6', id: 'KEYCODE_VIDEO_APP_6' },
							{ label: 'KEYCODE_VIDEO_APP_7', id: 'KEYCODE_VIDEO_APP_7' },
							{ label: 'KEYCODE_VIDEO_APP_8', id: 'KEYCODE_VIDEO_APP_8' },
							{ label: 'KEYCODE_FEATURED_APP_1', id: 'KEYCODE_FEATURED_APP_1' },
							{ label: 'KEYCODE_FEATURED_APP_2', id: 'KEYCODE_FEATURED_APP_2' },
							{ label: 'KEYCODE_FEATURED_APP_3', id: 'KEYCODE_FEATURED_APP_3' },
							{ label: 'KEYCODE_FEATURED_APP_4', id: 'KEYCODE_FEATURED_APP_4' },
							{ label: 'KEYCODE_DEMO_APP_1', id: 'KEYCODE_DEMO_APP_1' },
							{ label: 'KEYCODE_DEMO_APP_2', id: 'KEYCODE_DEMO_APP_2' },
							{ label: 'KEYCODE_DEMO_APP_3', id: 'KEYCODE_DEMO_APP_3' },
							{ label: 'KEYCODE_DEMO_APP_4', id: 'KEYCODE_DEMO_APP_4' }
						]
					}
				]
			}
			// setVolume: {
			//   type: 'number',
			//   label: 'Set Volume',
			//   id: 'set_volume',
			//   tooltip: 'Sets the volume percent (0-100)',
			//   min: 0,
			//   max: 100,
			//   default: 50,
			//   step: 0.5,
			//   required: true,
			//   range: false
			// }
		})
	}

	action(action) {
		let self = this
		switch (action.action) {
			case 'pair':
				try {
					self.tv.start()
					self.log('info', `Attempting to pair`)
				} catch (error) {
					self.log('debug', `Error: ${error}`)
					self.log('debug', `firmware: ${self.config.firmware}`)
					console.log(`firmware: ${self.config.firmware}`)
					console.log(`Error: ${error}`)
				}
				break

			case 'pin':
				self.parseVariables(action.options.pin, (value) => {
					self.debug(`Attempting to pair with pin [${value}]`)

					try {
						self.tv.sendCode(value)
						// might have to check if it is ready
					} catch (e) {
						self.debug(`Pairing result: ${JSON.stringify(e)}`)
						self.log('error', `Pairing failed. Make sure the provided pin is correct.`)
					}
				})
				break

			case 'power':
				self.parseVariables(action.options.power, (value) => {
					self.getVariable('power_state', (powerState) => {
						if (value === 'power_off') {
							self.tv.sendPower()
						} else if (value === 'power_on') {
							// get the macAddress of the tv
							const macAddress = self.config.macAddress

							wake(macAddress).catch((error) => {
								self.log('warning', `Error trying to wake up the Device.`)
								// console.error(error);
							})

							setTimeout(() => {
								wake(macAddress).catch((error) => {
									self.log('warning', `Error trying to wake up the Device.`)
									// console.error(error);
								})
							}, 3000)
						}
					})
				})

				break
			case 'mute':
				this.parseVariables(action.options.mute, (value) => {
					this.getVariable('volume_muted', (muteState) => {
						if (value === 'mute_off') {
							if (muteState) {
								self.tv.sendKey(RemoteKeyCode.KEYCODE_MUTE, RemoteDirection.SHORT)
							}
						} else if (value === 'mute_on') {
							if (!muteState) {
								self.tv.sendKey(RemoteKeyCode.KEYCODE_MUTE, RemoteDirection.SHORT)
							}
						}
					})
				})

				break
			case 'app_link':
				this.parseVariables(action.options.app_link, (value) => {
					try {
						this.tv.sendAppLink(value)
					} catch (e) {
						this.log('warning', `Error Trying to send applink ${value}. Error: ${e}`)
						console.log(e)
					}
				})

				break
			case 'button':
				this.parseVariables(action.options.button, (value) => {
					self.tv.sendKey(RemoteKeyCode[value], RemoteDirection.SHORT)
				})

				break
		}
	}

	init_variables() {
		let variables = [
			{
				label: 'Power',
				name: 'power_state'
			},
			{
				label: 'Volume Level',
				name: 'volume_level'
			},
			{
				label: 'Volume Max',
				name: 'volume_max'
			},
			{
				label: 'Volume Mute',
				name: 'volume_muted'
			},
			{
				label: 'Current App',
				name: 'current_app_state'
			}
		]

		this.setVariableDefinitions(variables)

		this.setVariable('power_state', '')
		this.setVariable('volume_level', '')
		this.setVariable('volume_max', '')
		this.setVariable('volume_muted', '')
		this.setVariable('current_app_state', '')
	}

	init_feedbacks() {
		const feedbacks = {}
		let self = this

		feedbacks['power_state'] = {
			label: 'Tv Power State',
			type: 'boolean',
			description: '',
			style: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 0, 0)
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'on/off',
					id: 'power',
					default: true,
					choices: [{ label: 'power on', id: true }, { label: 'power off', id: false }]
				}
			],
			callback: function(feedback) {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				// console.log("powerstate: ", powerState);
				try {
					if (self.tv?.state?.power == feedback.options.power) {
						return true
					} else {
						return false
					}
				} catch (error) {
					self.log('error', 'Feedback error: ' + error.message)
					return false
				}
			}
		}

		feedbacks['mute_state'] = {
			label: 'Tv Mute State',
			type: 'boolean',
			description: '',
			style: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 0, 0)
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'dropdown',
					label: 'on/off',
					id: 'mute',
					default: false,
					choices: [{ label: 'Mute On', id: true }, { label: 'Mute Off', id: false }]
				}
			],
			callback: function(feedback) {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				try {
					if (self.tv?.state?.volume?.muted == feedback.options.mute) {
						return true
					} else {
						return false
					}
				} catch (error) {
					console.log('Feedback Error:', error)
					self.log('error', 'Feedback error: ' + error.message)
					return false
				}
			}
		}

		feedbacks['current_app'] = {
			label: 'Current App',
			type: 'boolean',
			description: '',
			style: {
				// The default style change for a boolean feedback
				// The user will be able to customise these values as well as the fields that will be changed
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 0, 0)
			},
			// options is how the user can choose the condition the feedback activates for
			options: [
				{
					type: 'textinput',
					label: 'App ID',
					id: 'current_app',
					default: '',
					tooltip: 'ex. https://www.netflix.com/title/80057281'
				}
			],
			callback: function(feedback) {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				try {
					console.log(`${self.tv?.state?.currentApp} == ${feedback.options.current_app}`)
					if (self.tv?.state?.currentApp == feedback.options.current_app) {
						return true
					} else {
						return false
					}
				} catch (error) {
					self.log('error', 'Feedback error: ' + error.message)
					return false
				}
			}
		}

		this.setFeedbackDefinitions(feedbacks)
	}

	// setupVolume() {
	// }
}

function wake(mac) {
	return new Promise(function(resolve, reject) {
		wol.wake(mac, function(error) {
			if (error) {
				reject(error)
			} else {
				resolve('done')
			}
		})
	})
}

exports = module.exports = instance
