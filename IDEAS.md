Youtube bot, people vote what camera they want to see
!tommy (tom)
!cooley (coo)
!captain (cap)

## Nginx RTMP Server

This is the backbone, and fail-safe redundant medium for keeping connections open to the camera crew, and recording their video feeds.

## API Services

## UI

### Streams
`streams` from face value is the list of platforms that camera crew can broadcast to. This only works as a one to all relationship. One camera can connect to a list of activated platforms.

### Feeds
`feeds` Will be the location where camera crew can connect their cameras, and manage who gets broadcasted to `streams`

- feed to bubble state
  - application true
    - (broadcast === false) READY
        bg-emerald-600/700
    - (broadcast === true) LIVE
        bg-red-600/700
  - application false
    - (activated === true) OPEN
        bg-sky-600/700
    - (activated === false) DISABLED
        bg-gray-600/700
- feed to action button state
    - application true
        - (broadcast === false) READY
          bg-red-600/700
          "Broadcast Now"
        - (broadcast === true) LIVE
          bg-emerald-600/700
          "Disconnect"
    - application false
        - (broadcast === false) OPEN
          bg-red-600/700
          "Auto Broadcast"
        - (broadcast === true) OPEN
          bg-sky-600/700
          "Don't Broadcast"

### Recordings
`recordings` is the location where we record the live stream of every `feed`.

### Users
`users` are mobile only people, who are busy talking to predators. So simple, quick, and **accurate** user experience is paramount.


## Glossary

#### Accurate
In a context of mobile interactivity, this means prone to safe-guards from fat fingering. Examples would be, requirement to "touch and hold" on going live to the public view with count down, or an "Are you sure?" dialog to confirm deletion.