import Pusher from "pusher-js";
import * as React from "react";
import getConfig from "next/config";

const config = Object.assign({}, getConfig().publicRuntimeConfig.pusher);

const pusher = new Pusher(config.key, {
  cluster: config.cluster,
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
