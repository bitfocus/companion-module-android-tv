const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		PowerState: {
			name: 'Tv Power State',
			type: 'boolean',
			label: 'Tv Power State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'power',
					default: true,
					choices: [{ label: 'Power On', id: true }, { label: 'Power Off', id: false }]
				}
			],
			callback: (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				try {
					if (self.getVariableValue('power_state') == feedback.options.power) {
						return true
					} else {
						return false
					}
				} catch (error) {
					self.log('error', 'Feedback error: ' + error.message)
					return false
				}
			},
		},
		MuteState: {
			name: 'Tv Mute State',
			type: 'boolean',
			label: 'Tv Mute State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'mute',
					default: false,
					choices: [{ label: 'Mute On', id: true }, { label: 'Mute Off', id: false }]
				}
			],
			callback: (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				try {
					if (self.getVariableValue('volume_muted') == feedback.options.mute) {
						return true
					} else {
						return false
					}
				} catch (error) {
					console.log('Feedback Error:', error)
					self.log('error', 'Feedback error: ' + error.message)
					return false
				}
			},
		},
		VolumeState: {
			name: 'Tv Volume State',
			type: 'boolean',
			label: 'Tv Volume State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'volumeLevel',
					type: 'number',
					label: 'Volume Level',
					default: 0,
					min: 0,
					max: 100
				}
			],
			callback: (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				try {
					if (self.getVariableValue('volume_level') == feedback.options.volumeLevel) {
						return true
					} else {
						return false
					}
				} catch (error) {
					console.log('Feedback Error:', error)
					self.log('error', 'Feedback error: ' + error.message)
					return false
				}
			},
		},
		CurrentApp: {
			name: 'Current App',
			type: 'boolean',
			label: 'Current App',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'textinput',
					label: 'App ID',
					id: 'current_app',
					default: '',
					tooltip: 'ex. https://www.netflix.com/title/80057281'
				}
			],
			callback: (feedback) => {
				// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
				try {
					if (self.getVariableValue('current_app_state') == feedback.options.current_app) {
						return true
					} else {
						return false
					}
				} catch (error) {
					self.log('error', 'Feedback error: ' + error.message)
					return false
				}
			},
		},
	})
}
