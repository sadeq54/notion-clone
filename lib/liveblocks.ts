import {Liveblocks} from "@liveblocks/node"  

const key = process.env.LIVEBLOCKES_PRIVATE_KEY;

if (!key){

    throw new Error("LIVEBLOCKES_PRIVATE_KEY is not set")
}

const liveblocks = new Liveblocks({
    secret:key,
})

export default liveblocks;

