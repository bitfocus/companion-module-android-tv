module.exports = async function (self) {
	self.setVariableDefinitions([
		{ variableId: 'power_state', name: 'Power' },
		{ variableId: 'volume_level', name: 'Volume Level' },
		{ variableId: 'volume_max', name: 'Volume Max' },
		{ variableId: 'volume_muted', name: 'Volume Mute' },
		{ variableId: 'current_app_state', name: 'Current App' },
	])
}
