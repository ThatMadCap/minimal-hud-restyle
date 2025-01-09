---@diagnostic disable: cast-local-type
local mapData = require("data.mapData")
local serverId = GetPlayerServerId(PlayerId())
local debug = require("modules.utils.shared").debug
local interface = require("modules.interface.client")
local config = require("config.shared")
local utility = require("modules.utils.shared")
local sharedFunctions = require("config.functions")

local PlayerStatusThread = {}
PlayerStatusThread.__index = PlayerStatusThread

PlayerStatusThread.registry = {}

---@param identifier string
---@return table
function PlayerStatusThread.new(identifier)
	local self = setmetatable({}, PlayerStatusThread)
	self.identifier = identifier
	self.isVehicleThreadRunning = false

	PlayerStatusThread.registry[identifier] = self

	debug("(PlayerStatusThread:new) Created new instance with identifier: ", identifier)
	return self
end

AddStateBagChangeHandler('stress', ('player:%s'):format(serverId), function(_, _, value)
	stress = value
end)

function PlayerStatusThread:getIsVehicleThreadRunning()
	return self.isVehicleThreadRunning
end

---@param value boolean
function PlayerStatusThread:setIsVehicleThreadRunning(value)
	debug("(PlayerStatusThread:setIsVehicleThreadRunning) Setting: ", value)
	self.isVehicleThreadRunning = value
end

function PlayerStatusThread:start(vehicleStatusThread, seatbeltLogic, framework)
	CreateThread(function()
		while true do
			local ped = PlayerPedId()
			local playerId = PlayerId()
			local talking = NetworkIsPlayerTalking(playerId)
			local voice = 0
			local coords = GetEntityCoords(ped)
			local currentStreet, currentArea = GetStreetNameAtCoord(coords.x, coords.y, coords.z)

			currentStreet = GetStreetNameFromHashKey(currentStreet)
			currentArea = GetStreetNameFromHashKey(currentArea)

			local zone = GetLabelText(GetNameOfZone(coords.x, coords.y, coords.z))

			if mapData.streets[currentStreet] then
				currentStreet = mapData.streets[currentStreet]
			end

			if mapData.areas[currentArea] then
				currentArea = mapData.areas[currentArea]
			end

			local camRot = GetGameplayCamRot(0)
			local heading = utility.round(360.0 - ((camRot.z + 360.0) % 360.0))
			local compass = " "
			if (heading >= 0 and heading < 45) or (heading >= 315 and heading < 360) then
				compass = "N"
			elseif heading >= 45 and heading < 135 then
				compass = "W"
			elseif heading >= 135 and heading < 225 then
				compass = "S"
			elseif heading >= 225 and heading < 315 then
				compass = "E"
			end

			if LocalPlayer.state['proximity'] then
				if LocalPlayer.state['proximity'].mode == 'Whisper' then
					voice = 15
				elseif LocalPlayer.state['proximity'].mode == 'Normal' then
					voice = 50
				elseif LocalPlayer.state['proximity'].mode == 'Shouting' then
					voice = 100
				elseif voice == nil then
					voice = 0
				end
			end

			local pedArmor = GetPedArmour(ped)
			local pedHealthUnrestricted = math.floor(GetEntityHealth(ped) / GetEntityMaxHealth(ped) * 100)
			local pedHealth = math.max(0, math.min(pedHealthUnrestricted, 100))
			local pedHunger = framework and framework:getPlayerHunger() or nil
			local pedThirst = framework and framework:getPlayerThirst() or nil
			local pedStress = framework and framework:getPlayerStress() or nil
			local weapon = config.ox_inventory and exports.ox_inventory:getCurrentWeapon() or nil
			local ammoInInventory = nil
			if weapon then
				ammoInInventory = exports.ox_inventory:GetItemCount(weapon.ammo)
			end
			local isInVehicle = IsPedInAnyVehicle(ped, false)
			local isSeatbeltOn = config.useBuiltInSeatbeltLogic and seatbeltLogic.seatbeltState or
			sharedFunctions.isSeatbeltOn()

			if isInVehicle and not self:getIsVehicleThreadRunning() and vehicleStatusThread then
				vehicleStatusThread:start()
				debug("(playerStatus) (vehicleStatusThread) Vehicle status thread started.")
			end
			local data = {
				health = pedHealth,
				armor = pedArmor,
				hunger = pedHunger,
				thirst = pedThirst,
				stress = pedStress,
				streetLabel = currentStreet,
				areaLabel = zone,
				heading = compass,
				voice = voice,
				mic = talking,
				isSeatbeltOn = isSeatbeltOn,
				isInVehicle = isInVehicle,
				weapon = weapon,
				ammoInInventory = ammoInInventory
			}

			interface.message("setPlayerState", data)

			Wait(300)
		end
	end)
end

---@param identifier string
function PlayerStatusThread.getInstanceById(identifier)
	return PlayerStatusThread.registry[identifier]
end

return PlayerStatusThread
