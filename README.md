# Reinforcement Learning System

General reinforcement learning system with artificial intelligence agent and 
environment simulator.


## Installation

1. Install node.js from `http://nodejs.org/`. If you use Windows environment, 
   please add the node.js installation path to your work path.

2. Install dependent libraries:
   ```
   cd ./src/
   npm install
   ```


## Applications

The available applications are shown as followed, along with corresponding 
user manuals of the applications.

Of all the applications, the first thing to do is to launch the applications 
launcher by running the following instructions:

```
cd ./src/
npm start

>> <application_name>
```


### treasure_hunter

1. Run the instruction `next [state] [reward]` to gives the next state and the 
   corresponding instant reward to the reinforcement learning model, and 
   trigger the next status of the simulation system.

2. Run the instruction `show` to display the internal statistics.

3. Run the instruction `exit` to exit the program.


### sim_2dmap

1. Run the instruction `next [-m|--map]` the trigger the next status of the 
   simulation system, and the parameter is optional, with which the map of the 
   simulated environemnt will be displayed at each triggering.

2. Run the instruction `show agent|map|pos|position` to display the internal 
   statistics of the agent information, simulated environment map or the 
   position of the agent. One and only parameter is necessary to indicate the 
   statistics to display.

3. Run the instruction `exit` to exit the program.


### sim_2dmap_http

1. Open the browser and click into the website `http://localhost:3000/` to 
   launch the web application of the two-dimensional map example simulation 
   application.

2. Click the corresponding buttons on the control panel to perform certain 
   operation of the simulation system application. The `Initialize` button 
   can reset and initialize the reinforcement learning simulation system. The 
   `Next` button can manually trigger the next status of the simulation system 
   and update the client view. The `Auto On` button helps to turn on the 
   automatic next status triggering functionality at each 600ms, and refresh 
   the client view. The `Auto Off` botton helps to turn off the automatic next 
   status triggering functionality.


## Authorship

Below are authorship information of the project.

* __Author__:  David Qiu
* __Email__:   david@davidqiu.com
* __Website__: http://www.davidqiu.com/

Copyright (C) 2015, David Qiu. All rights reserved.
