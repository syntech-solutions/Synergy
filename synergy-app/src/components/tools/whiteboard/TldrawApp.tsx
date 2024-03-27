import {
  T,
  TLRecord,
  TLUiComponents,
  Tldraw,
  createTLStore,
  defaultShapeUtils,
  useEditor,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

interface TldrawAppProps {
  roomID: string;
}
export default function ({ roomID }: TldrawAppProps) {
  let changes: any = {};
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState(roomID);

  const store = createTLStore({
    shapeUtils: defaultShapeUtils,
  });
  const components: Required<TLUiComponents> = {
    DebugMenu: null,
  };

  useEffect(() => {
    // create the socket connection only once
    // const socket = io.connect("http://localhost:4001");
    const socket = io.connect("https://synergyserver-dev-eddj.1.us-1.fl0.io");
    setSocket(socket);
    socket?.on("connect", () => {
      socket?.emit("join room", room);
    });
    // clean up the connection when the component unmounts
    return () => socket.disconnect();
  }, []);

  store.listen((entry) => {
    changes = entry.changes;
    if (entry.source === "user") {
      sendBoard();
    }
  });

  const sendBoard = () => {
    socket?.emit("board sent", changes, room);
    console.log(room);
  };

  //use Effect if message recevied
  useEffect(() => {
    // handle the incoming messages
    socket?.on("board rec", (changes: any) => {
      const toRemove: TLRecord["id"][] = [];
      const toPut: TLRecord[] = [];

      for (const [id, record] of Object.entries(changes.added)) {
        toPut.push(record as TLRecord);
      }
      for (const [id, record] of Object.entries(changes.updated)) {
        if (
          id != "instance:instance" &&
          id != "camera:page:page" &&
          id != "pointer:pointer"
        ) {
          toPut.push(record[1]);
        }
      }

      for (const [id, record] of Object.entries(changes.removed)) {
        toRemove.push(record.id);
      }

      store.mergeRemoteChanges(() => {
        if (toRemove.length) store.remove(toRemove);
        if (toPut.length) store.put(toPut);
      });
    });
  }, [socket]);

  return (
    <>
      <Tldraw store={store} components={components} />
    </>
  );
}
