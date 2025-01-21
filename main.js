const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdatePresets = require('./presets')
const UpdateVariableDefinitions = require('./variables')

let AndroidRemote, RemoteKeyCode, RemoteDirection

const macfromip = require('macfromip')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.init_tv_connection()

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updatePresets() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}

	init_tv_connection() {
		this.updateStatus(InstanceStatus.Disconnected)

		if (this.config.host || this.config.bonjour_host) {
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
					this.config.certificate = {}
				}

				let host = this.config.bonjour_host ?? this.config.host

				if (host.includes(":")) {
					host = host.split(":").shift()
				}

				console.log('--Creating tv interface--')
				
				this.tv = new AndroidRemote(host, options)
				const theTV = this.tv
				
				

				console.log('--Setting Variables--')
				this.tv.on('powered', (powered) => {
					console.debug('Powered : ' + powered)
					this.setVariableValues({
						power_state: powered
					})
					this.updateStatus(InstanceStatus.Ok)
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
					this.updateStatus(InstanceStatus.UnknownError, 'Check Log')
					this.log('error', 'Network error: ' + error.message)
				})

				this.tv.on('unpaired', () => {
					console.error('Unpaired')
					this.updateStatus(InstanceStatus.UnknownWarning, 'Unpaired')
					this.log('error', 'Unpaired error')
					// this.config.certBool = false
					this.saveConfig({
						certificate: undefined,
						host: host,
						bonjour_host: this.config.bonjour_host,
						certBool: false,
						macAddress: this.config.macAddress,
						retryDuration: this.config.retryDuration
					})
				})

				this.tv.on('ready', async () => {
					await new Promise((resolve) => setTimeout(resolve, 2000))

					if (!this.config.macAddress || this.config.macAddress === '') {
						try {
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

					this.updateStatus(InstanceStatus.Ok)
					this.saveConfig({
						certificate: this.tv.getCertificate(),
						host: host,
						bonjour_host: this.config.bonjour_host,
						certBool: true,
						macAddress: this.config.macAddress,
						retryDuration: this.config.retryDuration
					})
				})

				if (this.config.certificate !== undefined && this.config.certificate.key !== undefined) {
					console.log('--Starting TV--');
					
					const timeoutDuration = 10000; // Timeout duration in milliseconds

					const timeoutPromise = new Promise((resolve, reject) => {
						setTimeout(() => {
							reject(new Error('Operation timed out'));
						}, timeoutDuration);
					});

					Promise.race([
						this.tv.start(),
						timeoutPromise
					]).then(result => {
							
							if (result === undefined) {
								this.updateStatus(InstanceStatus.ConnectionFailure, 'Check IP Address or re-pair(See help)')
								this.log('error', `Unable to Connect to ${this.config.host}.`)
							} else {
								this.updateStatus(InstanceStatus.Ok)
							}

							this.tv.remoteManager.on('error', (error) => {
								console.error('RemoteManager Error')
								this.updateStatus(InstanceStatus.UnknownError, 'Check Log')
								console.error(JSON.stringify(error));
							})
						}).catch(error => {
							
							if (error.message === 'Operation timed out') {
								this.updateStatus(InstanceStatus.ConnectionFailure, 'Check IP Address. Is device on?')
								this.log('error', `Unable to Connect to ${this.config.host}.`)
							} else {
								console.log('starting error', error)
								
								this.log('error', error.message)
								console.error(error);
							}
						});
					
				} else {
					this.updateStatus(InstanceStatus.UnknownWarning, 'Unpaired')
				}
			})
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

	configUpdated(config) {
		this.init(config)
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
				This module will connect to most new AndroidTVs. Click on the question mark above and to the right for pairing and helpful instructions.
			`
			},
			{
				type: 'bonjour-device',
				id: 'bonjour_host',
				label: 'Automatic Search',
				width: 6,
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				isVisible: (options) => !options['bonjour_host'],
				default: '',
				regex: Regex.IP
			},
			{
				type: 'static-text',
				id: 'host-filler',
				width: 6,
				label: '',
				isVisible: (options) => !!options['bonjour_host'],
				value: '',
			},
			{
				type: 'textinput',
				id: 'macAddress',
				label: 'Target Mac Address (automatically found during pairing)',
				width: 6,
				default: '',
				regex: '/^([0-9a-f]{2}([:.-]{0,1}|$)){6}$/i'
			},
			{
				type: 'checkbox',
				label: 'Paired',
				id: 'certBool',
				width: 6,
				default: false,
				tooltip: 'Uncheck and hit save button to clear saved credentials.'
			},
			{
				type: 'number',
				label: 'Power On Retry Duration (in seconds)',
				id: 'retryDuration',
				width: 6,
				default: 6,
				min: 0,
				max: 60,
				tooltip: 'Take up to X seconds trying to power the TV on ethernet connections.',
				isVisible: () => false, // Hide
			}
		]
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
