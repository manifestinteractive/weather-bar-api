![Weather Bar Logo](logo.png "Weather Bar Logo")

**[↤ Developer Overview](../README.md)**

Troubleshooting
===

This document will contain a list of known issues, and how to solve them.

Windows
---

You are going to have a hard time using this on Windows, but if you must, here are some known commands you will need to run.  Open a new PowerShell using "Run as Administrator" and run the following:

```bash
npm install --global  --production windows-build-tools
npm config set msvs_version 2015 --global
npm config set loglevel warn
```

Close all instances of shell/cmd and reopen before attempting to run any `npm` commands in this library.

For installation of this library, on Windows you should run the installer using:

```bash
npm install --no-optional
```

Before you run any scripts, you will also need to set Environmental Variables for the app.

Seed Errors
---

#### `ER_NET_PACKET_TOO_LARGE`

The following error can happen on machines with low memory settings for MySQL.

```
× SEED ERROR ER_NET_PACKET_TOO_LARGE: Got a packet bigger than 'max_allowed_packet' bytes
```

To fix this issue, connect as a `root` user to MySQL and run this query:

```sql
set global net_buffer_length=1000000;
set global max_allowed_packet=1000000000;
```
