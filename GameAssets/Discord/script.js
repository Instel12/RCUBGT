let auth = localStorage.getItem("token");

const serverList = document.getElementsByClassName("serverList")[0];
const channelList = document.getElementsByClassName("channelList")[0];
const messages = document.getElementsByClassName("messages")[0];

const dmIcon = document.getElementsByClassName("dmIcon")[0];

const messageBox = document.getElementById("messageBox");
const sendButton = document.getElementById("sendButton");

let currentChannel = null;
let canSend = false;

let gateway;
let sessionID;
let heartbeatInterval;

let myUserId = null;
let currentGuildID = null;

sendButton.onclick = sendMessage;

messageBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function getMyUser() {
    const res = await fetch(
        "https://discord.com/api/v10/users/@me",
        {
            headers: {
                "Authorization": auth
            }
        }
    );

    const data = await res.json();

    myUserId = data.id;
}

getMyUser();

async function getGuildPermissions(guildID, channel) {
    const [memberRes, rolesRes] = await Promise.all([

        fetch(
            `https://discord.com/api/v10/guilds/${guildID}/members/${myUserId}`,
            {
                headers:{
                    "Authorization": auth
                }
            }
        ),

        fetch(
            `https://discord.com/api/v10/guilds/${guildID}/roles`,
            {
                headers:{
                    "Authorization": auth
                }
            }
        )
    ]);

    const member = await memberRes.json();
    const roles = await rolesRes.json();

    let permissions = 0n;
    for (const role of roles) {
        if (
            role.id === channel.guild_id ||
            member.roles.includes(role.id)
        ) {
            permissions |= BigInt(role.permissions);
        }
    }

    if ((permissions & 8n) === 8n)return true;
    if (channel.permission_overwrites) {
        for (const overwrite of channel.permission_overwrites) {

            if (member.roles.includes(overwrite.id) ||
                overwrite.id === myUserId) {
                permissions &= ~BigInt(overwrite.deny);
                permissions |= BigInt(overwrite.allow);
            }
        }
    }
    return (permissions & 2048n) === 2048n;
}

async function connectGateway() {
    const res = await fetch("https://discord.com/api/v10/gateway");

    const data = await res.json();
    gateway = new WebSocket(data.url + "?v=10&encoding=json");

    gateway.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        handleGatewayEvent(payload);
    };

    gateway.onopen = () => {
        console.log("Gateway connected");
    };
}

async function sendMessage() {
    if (!currentChannel || !canSend) return;

    const content = messageBox.value.trim();

    if (!content) return;

    await fetch(
        `https://discord.com/api/v10/channels/${currentChannel.id}/messages`,
        {
            method: "POST",
            headers: {
                "Authorization": auth,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: content
            })
        }
    );


    messageBox.value = "";
    loadMessages(currentChannel.id);
}

function getAvatar(user) {
    if (user.avatar) {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
    }

    return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(user.id) >> 22n) % 6}.png`;
}

async function refreshServerList() {
    const res = await fetch(
        "https://discord.com/api/v10/users/@me/guilds",
        {
            headers: {
                "Authorization": auth
            }
        }
    );

    const data = await res.json();
    serverList.querySelectorAll(".serverIcon").forEach(e => e.remove());
    for (const guild of data) {
        const img = document.createElement("img");

        if (guild.icon) {
            const extension = guild.icon.startsWith("a_") ? "gif" : "png";
            img.src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${extension}?size=128`;
        } else {
            img.src = "default-icon.png";
        }

        img.className = "serverIcon";
        img.title = guild.name;

        img.onclick = () => {
            loadChannels(guild.id);
        };

        serverList.appendChild(img);
    }
}

async function loadChannels(guildID) {
    currentGuildID = guildID;
    const res = await fetch(
        `https://discord.com/api/v10/guilds/${guildID}/channels`,
        {
            headers: {
                "Authorization": auth
            }
        }
    );

    const data = await res.json();
    for (const channel of data) {
        channel.guild_id = guildID;
    }

    channelList.innerHTML = "";

    const categories = {};
    for (const channel of data) {
        if (channel.type === 4) {
            categories[channel.id] = {
                name: channel.name,
                channels: []
            };
        }
    }

    for (const channel of data) {
        if (channel.type !== 0 && channel.type !== 5) continue;

        if (!canViewChannel(channel)) continue;
        if (channel.parent_id && categories[channel.parent_id]) {
            categories[channel.parent_id].channels.push(channel);
        }
    }

    for (const id in categories) {
        const category = categories[id];
        if (category.channels.length === 0) continue;

        const cat = document.createElement("div");

        cat.className = "category";
        cat.innerText = category.name;

        channelList.appendChild(cat);

        for (const channel of category.channels) {
            createChannel(channel);
        }
    }

    for (const channel of data) {
        if (
            (channel.type === 0 || channel.type === 5) &&
            !channel.parent_id &&
            canViewChannel(channel)
        ) {
            createChannel(channel);
        }
    }
}

function createChannel(channel) {
    const div = document.createElement("div");

    div.className = "channel";
    div.innerText = "# " + channel.name;

    div.onclick = async () => {
        currentChannel = channel;
        canSend = await getGuildPermissions(
            channel.guild_id,
            channel
        );

        messageBox.disabled = !canSend;
        sendButton.disabled = !canSend;

        loadMessages(channel.id);
    };

    channelList.appendChild(div);
}

function canViewChannel(channel) {
    if (!channel.permissions)return true;

    const permissions = BigInt(channel.permissions);
    return (permissions & 1024n) === 1024n;
}

dmIcon.onclick = () => {
    loadDMs();
};

async function loadDMs() {

    const res = await fetch(
        "https://discord.com/api/v10/users/@me/channels",
        {
            headers: {
                "Authorization": auth
            }
        }
    );

    const data = await res.json();
    channelList.innerHTML = "";

    for (const dm of data) {
        if (dm.type !== 1) continue;
        const user = dm.recipients[0];
        const div = document.createElement("div");

        div.className = "channel";
        div.innerHTML = `<img class="dmAvatar" src="${getAvatar(user)}">${user.username}`;

        div.onclick = () => {
            currentChannel = dm;
            canSend = canSendInChannel(dm);

            messageBox.disabled = !canSend;
            sendButton.disabled = !canSend;

            loadMessages(dm.id);
        };


        channelList.appendChild(div);
    }
}

function canSendInChannel(channel) {
    if (channel.type === 1) return true;
    if (!channel.permissions) return false;

    const permissions = BigInt(channel.permissions);

    if ((permissions & 8n) === 8n) return true;
    return (permissions & 2048n) === 2048n;
}

async function loadMessages(channelID) {
    const res = await fetch(
        `https://discord.com/api/v10/channels/${channelID}/messages`,
        {
            headers: {
                "Authorization": auth
            }
        }
    );

    const data = await res.json();
    if (!Array.isArray(data)) {

        console.log(data);
        return;

    }

    messages.innerHTML = "";
    data.reverse();

    for (const message of data) {
        const div = document.createElement("div");
        div.className = "message";
        const user = message.author;

        div.innerHTML = `
            <div class="messageHeader">
                <img class="avatar" src="${getAvatar(user)}">
                <div class="username">${user.username}</div>
            </div>

            <div class="messageText">
                ${message.content || ""}
            </div>
        `;

        messages.appendChild(div);
    }

    messages.scrollTop = messages.scrollHeight;
}

function handleGatewayEvent(payload) {
    const { op, t, d } = payload;
    if (op === 10) {
        heartbeatInterval = setInterval(() => {
            gateway.send(JSON.stringify({
                op: 1,
                d: null
            }));
        }, d.heartbeat_interval);

        identify();
    }

    if (t === "MESSAGE_CREATE") {
        if (!currentChannel) return;
        if (d.channel_id !== currentChannel.id) return;
        addMessage(d);
    }
}

function identify() {
    gateway.send(JSON.stringify({
        op: 2,
        d: {
            token: auth,
            intents: 513,
            properties: {
                os: "windows",
                browser: "custom-client",
                device: "custom-client"
            }
        }
    }));
}

function addMessage(message) {
    const div = document.createElement("div");
    div.className = "message";
    const user = message.author;

    div.innerHTML = `
        <div class="messageHeader">
            <img class="avatar" src="${getAvatar(user)}">
            <div class="username">${user.username}</div>
        </div>
        <div class="messageText">${message.content || ""}</div>
    `;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

(async () => {
    if (!localStorage.getItem("token")) localStorage.setItem("token", prompt("What is you auth value?"));
    await getMyUser();
    await refreshServerList();
    connectGateway();
})();