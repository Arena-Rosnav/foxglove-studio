# Foxglove Studio for Arena Web-Application

![Arena Rosnav version](https://img.shields.io/github/v/tag/Arena-Rosnav/arena-rosnav?label=Arena%20Rosnav%20version)

## Introduction
This repository represents Foxglove visualization support for ROS (Robotic Operating System) based [full-stack application](https://github.com/Arena-Rosnav/arena-web-v2). Foxglove has been integrated within to enable advanced data and objects visualization of robot activities generated and distributed by [Arena Rosnav project](https://github.com/Arena-Rosnav/Arena-Rosnav).
Contribution from this integration comprises implemention of special extensions meant to covert _ROS topics_ into the format understandable by the Foxglove. In this manner we developed support for pedestrains movements, navigation stack parameters and occupancy map. 

## Installation

- Make sure to adequately setup the Arena-Web application from this [guide](https://github.com/Arena-Rosnav/arena-web-v2/blob/master/README.md):

- Navigate into `packages` directory:
```
cd ~/arena-web-v2/packages
```

- Clone this repository

```
git clone https://github.com/servetoz/foxglove-studio.git
```

- Install 'git-lfs' (https://git-lfs.github.com/)

```
sudo apt install git-lfs
git lfs install
```

- Pull the large files

```
git lfs pull
```

- Install the dependencies

```
yarn install
```

- Build the project

```
npm run web:build:prod
```

- Serve the project

```
npm run web:serve
```

For more information on Foxglove Studio, plase visit the official repository: https://github.com/foxglove/studio
