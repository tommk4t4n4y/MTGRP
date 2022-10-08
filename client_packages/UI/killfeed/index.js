const weaponData = require("./weaponData");

mp.events.add("playerDeath", (player, reason, killer) => {
    let msg = `${player.name.replace("_", " ")} ( ${player.id} ) умер`;

    if (killer) {
        if (killer.name == player.name) {
            msg = `${player.name.replace("_", " ")} (${player.id})  покончил жизнь самоубийством`;
        } else {
            msg = `${killer.name.replace("_", " ")} ( ${killer.id} )  убил ${player.name.replace("_", " ")} ( ${player.id} )`;
            if (weaponData[reason]) msg += ` из ${weaponData[reason].Name}`;
        }
    }

    mp.players.forEach(play => {
        if (play.getVariable('IS_ADMIN')) {
            play.call("pushToKillFeed", [msg]);

        };
    });
});