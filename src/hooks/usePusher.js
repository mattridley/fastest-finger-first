import Pusher from "pusher-js";
import * as React from "react";

const pusher = new Pusher("ec26b229afe9fbf00ab0", {
  cluster: "eu",
});

const channelSubscriptions = new Map();

export function usePusherChannel(channel, cb) {
  React.useEffect(() => {
    let subscription = channelSubscriptions.get(channel);

    if (!subscription) {
      subscription = pusher.subscribe(channel);
      channelSubscriptions.set(channel, subscription);
    }

    subscription.bind_global(cb);
    return () => subscription.unbind_global(cb);
  }, [channel, cb]);
}
