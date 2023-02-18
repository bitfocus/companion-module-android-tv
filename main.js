const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdatePresets = require('./presets')
const UpdateVariableDefinitions = require('./variables')

let AndroidRemote, RemoteKeyCode, RemoteDirection

// const wol = require('wake_on_lan')
const macfromip = require('macfromip')
const bonjour = require('bonjour')()

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		//'ok', 'connecting', 'disconnected', 'connection_failure', 'bad_config', 'unknown_error', 'unknown_warning'
		this.config = config
		this.CHOICES_DEVICES = []

		this.init_tv_connection()

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updatePresets() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}

	init_tv_connection() {
		this.updateStatus('disconnected')

		if (this.config.host) {
			import('androidtv-remote').then((AndroidTV) => {
				this.updateStatus('connecting', 'Connecting')
				console.log('--Starting AndroidTV-Remote--')
				AndroidRemote = AndroidTV.AndroidRemote
				RemoteKeyCode = AndroidTV.RemoteKeyCode
				RemoteDirection = AndroidTV.RemoteDirection

				this.RemoteKeyCode = RemoteKeyCode
				this.RemoteDirection = RemoteDirection

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
				const theTV = this.tv

				console.log('--Setting Variables--')
				this.tv.on('powered', (powered) => {
					console.debug('Powered : ' + powered)
					this.setVariableValues({
						power_state: powered
					})
					this.checkFeedbacks('PowerState')
				})

				this.tv.on('volume', (volume) => {
					this.setVariableValues({
						volume_level: volume.level,
						volume_max: volume.maximum,
						volume_muted: volume.muted
					})
					this.checkFeedbacks()
					// console.debug('Volume : ' + volume.level + '/' + volume.maximum + ' | Muted : ' + volume.muted)
				})

				this.tv.on('current_app', (current_app) => {
					this.setVariableValues({
						current_app_state: current_app
					})
					// console.debug('Current App : ' + current_app)
					this.checkFeedbacks('CurrentApp')
				})

				this.tv.on('error', (error) => {
					console.error('There was an Error!!!')
					this.updateStatus('unknown_error')
					this.log('error', 'Network error: ' + error.message)
				})

				this.tv.on('unpaired', () => {
					console.error('Unpaired')
					this.updateStatus('unknown_warning', 'Unpaired')
					this.log('error', 'Unpaired error')
					// this.config.certBool = false
					this.saveConfig({ certificate: undefined, host: this.config.host, certBool: false, macAddress: this.config.macAddress})
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

					// this.config.certificate = this.tv.getCertificate()
					// this.config.certBool = true

					this.updateStatus('ok')
					this.saveConfig({ certificate: this.tv.getCertificate(), host: this.config.host, certBool: true, macAddress: this.config.macAddress})
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

	// When module gets deleted or disabled
	async destroy() {
		if (this.tv !== undefined) {
			this.tv.remoteManager.client.destroy()
			this.tv.stop()
			this.tv = undefined
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
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
				regex: Regex.IP
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

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
