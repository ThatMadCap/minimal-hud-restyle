-- Core Logic
local playerStatusClass = require("modules.threads.client.playerStatus")
local vehicleStatusClass = require("modules.threads.client.vehicleStatusThread")

local playerStatus = playerStatusClass.new("main")
local vehicleStatus = vehicleStatusClass.new(playerStatus)

playerStatus:start(vehicleStatus)
