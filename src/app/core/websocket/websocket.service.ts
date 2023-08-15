// src\app\services\websocket.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Observer, fromEvent } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from "environments/environment";


export interface Message {
    command: string;
    action: string;
    result?: string;
}

@Injectable()
export class WebsocketService {
    private subject: AnonymousSubject<MessageEvent>;
    public messages: Subject<Message>;
    private connexionState: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor() {
        this.messages = <Subject<Message>>this.connect(environment.SOCKET_URL).pipe(
            map(
                (response: MessageEvent): Message => {
                    console.log(response.data);
                    let data = JSON.parse(response.data)
                    return data;
                }
            )
        );
    }

    public connect(url): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
            console.log("Successfully connected: " + url);
        }
        console.log("subject====>", this.subject)
        return this.subject;
    }



    private create(url): AnonymousSubject<MessageEvent> {
        let ws = new WebSocket(url);
        console.log("create socket");
        let observable = new Observable((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });
        let observer = {
            error: null,
            complete: null,
            next: (data: Object) => {

                console.log('message: ', data);
                //Envoyer le message si la connexion est ouverte
                if (ws.readyState === WebSocket.OPEN) {
                    console.log("message is sent")
                    ws.send(JSON.stringify(data));
                } else {
                    //Attendre l'ouverture et envoyer le message
                    ws.onopen = () => {
                        ws.send(JSON.stringify(data));
                    };
                }
            }
        };
        return new AnonymousSubject<MessageEvent>(observer, observable);
    }
}
