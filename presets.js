const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setPresetDefinitions({
		leftButton: {
			type: 'button', // This must be 'button' for now
			category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Left Button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `⬅️`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_DPAD_LEFT',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		rightButton: {
			type: 'button', // This must be 'button' for now
			category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Right Button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `➡️`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_DPAD_RIGHT',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		upButton: {
			type: 'button', // This must be 'button' for now
			category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Up Button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `⬆️`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_DPAD_UP',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		downButton: {
			type: 'button', // This must be 'button' for now
			category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Down Button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `⬇️`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_DPAD_DOWN',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		centerButton: {
			type: 'button', // This must be 'button' for now
			category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Center Button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `OK`, // You can use variables from your module here
				size: '30',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_DPAD_CENTER',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		backButton: {
			type: 'button', // This must be 'button' for now
			category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Back Button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `↪️`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_BACK',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		homeButton: {
			type: 'button', // This must be 'button' for now
			category: 'Navigation', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Home Button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `🏠`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_HOME',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		powerButtonOn: {
			type: 'button', // This must be 'button' for now
			category: 'Power', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Power ON`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `ON`, // You can use variables from your module here
				size: '30',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'power',
							options: {
								// options values to use
								power: 'power_on',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'PowerState',
					options: {
						power: true,
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		powerButtonOff: {
			type: 'button', // This must be 'button' for now
			category: 'Power', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Power Off`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `OFF`, // You can use variables from your module here
				size: '30',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'power',
							options: {
								// options values to use
								power: 'power_off',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'PowerState',
					options: {
						power: false,
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		volumeUp: {
			type: 'button', // This must be 'button' for now
			category: 'Volume', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Volume Up`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `🔊`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_VOLUME_UP',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
			], // You can add some presets from your module here
		},
		volumeDown: {
			type: 'button', // This must be 'button' for now
			category: 'Volume', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Volume Down`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `🔉`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'sendButton',
							options: {
								// options values to use
								remoteButton: 'KEYCODE_VOLUME_DOWN',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
			], // You can add some presets from your module here
		},
		setVolumeButton: {
			type: 'button', // This must be 'button' for now
			category: 'Volume', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Specific Volume`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Volume 0`, // You can use variables from your module here
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'setVolumeLevel',
							options: {
								// options values to use
								volumeLevel: 0,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'VolumeState',
					options: {
						volumeLevel: 0
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		volumeMute: {
			type: 'button', // This must be 'button' for now
			category: 'Volume', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Volume Mute`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `🔇`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'mute',
							options: {
								// options values to use
								mute: 'mute_on',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'MuteState',
					options: {
						mute: true,
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		volumeUnMute: {
			type: 'button', // This must be 'button' for now
			category: 'Volume', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Volume Unmute`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `🔈`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'mute',
							options: {
								// options values to use
								mute: 'mute_off',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'MuteState',
					options: {
						mute: false,
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		volume: {
			type: 'button', // This must be 'button' for now
			category: 'Volume', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Volume`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Vol: $(generic-module:volume_level)`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [], // You can add some presets from your module here
		},
		netflixButton: {
			type: 'button', // This must be 'button' for now
			category: 'Apps', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Launch Netflix`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Netflix`, // You can use variables from your module here
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'app_link',
							options: {
								// options values to use
								app_link: 'https://www.netflix.com/title/',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'CurrentApp',
					options: {
						current_app: 'com.netflix.ninja',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		disneyButton: {
			type: 'button', // This must be 'button' for now
			category: 'Apps', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Launch Disney+`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Disney+`, // You can use variables from your module here
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'app_link',
							options: {
								// options values to use
								app_link: 'https://www.disneyplus.com/',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'CurrentApp',
					options: {
						current_app: 'com.disney.disneyplus',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		huluButton: {
			type: 'button', // This must be 'button' for now
			category: 'Apps', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Launch Hulu`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Hulu`, // You can use variables from your module here
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'app_link',
							options: {
								// options values to use
								app_link: 'https://hulu.com/',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'CurrentApp',
					options: {
						current_app: 'com.hulu.plus',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		youtubeButton: {
			type: 'button', // This must be 'button' for now
			category: 'Apps', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Launch Youtube`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Youtube`, // You can use variables from your module here
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'app_link',
							options: {
								// options values to use
								app_link: 'https://youtube.com/',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'CurrentApp',
					options: {
						current_app: 'com.google.android.youtube.tv',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		amazonButton: {
			type: 'button', // This must be 'button' for now
			category: 'Apps', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Launch Amazon Prime`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Amazon Prime`, // You can use variables from your module here
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'app_link',
							options: {
								// options values to use
								app_link: 'https://watch.amazon.com',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'CurrentApp',
					options: {
						current_app: 'com.amazon.amazonvideo.livingroom',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], // You can add some presets from your module here
		},
		currentApp: {
			type: 'button', // This must be 'button' for now
			category: 'Apps', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Current App`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `App: $(generic-module:current_app_state)`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
					],
					up: [],
				},
			],
			feedbacks: [
			], // You can add some presets from your module here
		},
		pairingButton: {
			type: 'button', // This must be 'button' for now
			category: 'Pairing', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Pair TV`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Pair`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'pair',
							options: {
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
			], // You can add some presets from your module here
		},
		sendPinButton: {
			type: 'button', // This must be 'button' for now
			category: 'Pairing', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `Send Pin to TV`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Send Pin`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'pin',
							options: {
								pin: ''
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
			], // You can add some presets from your module here
		},
	})
	//com.hulu.plus
}
