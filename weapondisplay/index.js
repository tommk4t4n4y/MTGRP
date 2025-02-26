const weaponData = require("./weaponData");

const PistolAttachmentPos = new mp.Vector3(0.02, 0.06, 0.1);
const PistolAttachmentRot = new mp.Vector3(-100.0, 0.0, 0.0);


const ShotgunAttachmentPos = new mp.Vector3(-0.1, -0.15, 0.11);
const ShotgunAttachmentRot = new mp.Vector3(-180.0, 0.0, 0.0);

const RifleAttachmentPos = new mp.Vector3(-0.1, -0.15, -0.13);
const RifleAttachmentRot = new mp.Vector3(0.0, 0.0, 3.5);

/*
    Weapon names have to be uppercase!
    You can get attachment bone IDs from https://wiki.rage.mp/index.php?title=Bones
 */
const weaponAttachmentData = {
    // Pistols
    "WEAPON_RAYPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },

    // Submachine Guns


    // Shotguns
    "WEAPON_PUMPSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_PUMPSHOTGUN_MK2": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_SAWNOFFSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_ASSAULTSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_BULLPUPSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_HEAVYSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_RPG": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },

    // Rifles
    "WEAPON_ASSAULTRIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_ASSAULTRIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_CARBINERIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_CARBINERIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_SPECIALCARBINE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_SPECIALCARBINE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_MARKSMANRIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_MARKSMANRIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot }
};
// Update weaponAttachmentData with attachment name and model
for (let weapon in weaponAttachmentData) {
    let hash = mp.joaat(weapon);

    if (weaponData[hash]) {
        weaponAttachmentData[weapon].AttachName = `WDSP_${weaponData[hash].HashKey}`;
        weaponAttachmentData[weapon].AttachModel = weaponData[hash].ModelHashKey;
    } else {
        console.log(`[!] ${weapon} not found in weapon data file and will cause issues, remove it from weaponAttachmentData.`);
    }
}

mp.events.add("playerReady", (player) => {
    player._bodyWeapons = {};
    player.call("registerWeaponAttachments", [ JSON.stringify(weaponAttachmentData) ]);
});

mp.events.add("playerWeaponChange", (player, oldWeapon, newWeapon) => {
    if (weaponData[oldWeapon]) {
        let oldWeaponKey = weaponData[oldWeapon].HashKey;
        if (weaponAttachmentData[oldWeaponKey]) {
            // Remove the attached weapon that is occupying the slot
            let slot = weaponAttachmentData[oldWeaponKey].Slot;
            if (player._bodyWeapons[slot] && player.hasAttachment(player._bodyWeapons[slot])) player.addAttachment(player._bodyWeapons[slot], true);

            // Attach the updated old weapon
            let attachName = weaponAttachmentData[oldWeaponKey].AttachName;
            player.addAttachment(attachName, false);
            player._bodyWeapons[slot] = attachName;
        }
    }

    if (weaponData[newWeapon]) {
        let newWeaponKey = weaponData[newWeapon].HashKey;
        if (weaponAttachmentData[newWeaponKey]) {
            // De-attach the new/current weapon (if attached)
            let slot = weaponAttachmentData[newWeaponKey].Slot;
            let attachName = weaponAttachmentData[newWeaponKey].AttachName;

            if (player._bodyWeapons[slot] === attachName) {
                if (player.hasAttachment(attachName)) player.addAttachment(attachName, true);
                delete player._bodyWeapons[slot];
            }
        }
    }
});

// De-attach all weapons on death
mp.events.add("playerDeath", (player) => {
    for (let name in player._bodyWeapons) {
        player.addAttachment(player._bodyWeapons[name], true);
        delete player._bodyWeapons[name];
    }
});