# NXSamples
NX Samples contains samples for many frontend techs combined with different bundlers

## Preparation

Make sure you have latest stable Node.js installed on your machine. If not, you can download it from [here](https://nodejs.org/).

Invoke following command once - this will allow to use for example Yarn v4:

```cmd
corepack enable
```

## NX Setup

All samples are based on NX workspace. To create new workspace, invoke following command:

```cmd
npx create-nx-workspace@latest --package-manager=yarn
```

After creation of workspace I upgraded yarn to v4:

```cmd
yarn set version berry
yarn set version stable
yarn
```

## Special considerations

In every sample I created separate config.ts (in once case config.js due to limitation of bundler configuration) in which I store all configuration values. This is to avoid hardcoding of values in the code.
Whole configuration is done in such way that it creates separate for configuration. By doing that I am able to replace configuration values in the docker start stage. Sample of such docker container is [here](https://github.com/AdaskoTheBeAsT/nginx-brotli).

Besides that every sample contains also compress step which additionally compress all assets to gzip and brotli format. This allows to create super small bundles and those bundles are then served by specially crafted nginx server which is able to serve those files. This limits greatly the amount of data transferred over the network.
