# Act Player

This is a demonstration of an Amazon IVS player. It contains a simulated keyboard driven by Timed Metadata cues.

[Check out the live demo](http://act-player-video-archive.s3-website-us-east-1.amazonaws.com/)

Also checkout my pairing projects

[act-rtmp-encoder](https://github.com/skliffmueller/act-rtmp-encoder) Which was used in generating the demo live stream above.

[Act IVS API](https://github.com/skliffmueller/act-ivs-api) Which generates the list.json file for video lists

## Tech Stacks

- [Amazon IVS Player](https://docs.aws.amazon.com/ivs/latest/userguide/player-web.html)
- [Timed Metadata](https://docs.aws.amazon.com/ivs/latest/userguide/metadata.html#metadata-consuming)
- [Typescript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/)
- [React](https://reactjs.org/)
- [Webpack](https://webpack.js.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [Hero Icons](https://heroicons.com/)

## Install

Built using node v14
```
npm install
```

## Run development

```
npm run dev
```
Will be accessable at http://localhost:8080/

## Build Production

```
npm run build
```
Files will be bundled in `./dist` folder at the root of the project directory.