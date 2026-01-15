import User from "./user.model.js";
import Video from "./video.model.js";
import TextGuide from "./text.model.js";
import SpeciesDictionary from "./speciesDictionary.model.js";
import { broadcastStats } from "../lib/statsBroadcaster.js";

export const setupHooks = () => {
  const models = [User, Video, TextGuide, SpeciesDictionary];

  models.forEach((model) => {
    model.addHook("afterCreate", () => {
      setImmediate(() => {
        // Pass 'true' to force a fresh DB count
        broadcastStats(true).catch(err => console.error("Hook update failed", err));
      });
    });

    model.addHook("afterDestroy", () => {
      setImmediate(() => {
        broadcastStats(true).catch(err => console.error("Hook delete failed", err));
      });
    });
  }); 
};