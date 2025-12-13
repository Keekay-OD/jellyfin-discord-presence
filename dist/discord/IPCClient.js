import net from "net";
import os from "os";
import { randomUUID } from "crypto";
export class DiscordIPC {
    constructor(clientId) {
        this.socket = null;
        this.connected = false;
        this.clientId = clientId;
    }
    connect() {
        return new Promise((resolve, reject) => {
            const pipe = this.getPipe();
            this.socket = net.createConnection(pipe, () => {
                this.connected = true;
                this.handshake();
                resolve();
            });
            this.socket.on("error", reject);
        });
    }
    getPipe() {
        const pipeNumber = 0;
        if (os.platform() === "win32") {
            return `\\\\?\\pipe\\discord-ipc-${pipeNumber}`;
        }
        else {
            return `${process.env.XDG_RUNTIME_DIR ?? "/tmp"}/discord-ipc-${pipeNumber}`;
        }
    }
    handshake() {
        this.send(0, {
            v: 1,
            client_id: this.clientId
        });
    }
    send(op, data) {
        if (!this.connected || !this.socket)
            return;
        const payload = Buffer.from(JSON.stringify(data), "utf8");
        const header = Buffer.alloc(8);
        header.writeInt32LE(op, 0);
        header.writeInt32LE(payload.length, 4);
        this.socket.write(Buffer.concat([header, payload]));
    }
    setActivity(activity) {
        this.send(1, {
            cmd: "SET_ACTIVITY",
            args: {
                pid: process.pid,
                activity
            },
            nonce: randomUUID()
        });
    }
}
