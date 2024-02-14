## Customizations in Foxglove for Arena-Rosnav
**Different extensions** have been developed to convert ROS topics into the format understandable by the Foxglove.

1. **pedsimAgentConverter.ts** (located in `packages/studio-base/src/extensions/arena/pedsimAgentConverter.ts`): This extension converts the ROS topic `/pedsim_msgs/AgentStates` into the format understandable by the Foxglove [SceneEntity ModelPrimitive[]](https://docs.foxglove.dev/docs/visualization/message-schemas/scene-entity/). The Foxglove uses this format to visualize the agents in the simulation.
    - The 3D model is hard-coded in the extension. The model is downloaded from [sketchfab](https://sketchfab.com/3d-models/nathan-animated-003-walking-3d-man-143a2b1ea5eb4385ae90a73657aca3bc).
    - Animation and model scaling can be customized in the extension.
    ```typescript
        const model: ModelPrimitiveAnimated = {
          pose: agentState.pose,
          scale: { x: 0.013, y: 0.013, z: 0.013 },
          color: { r: 1, g: 0, b: 0, a: 1 },
          url: `${hostOrigin}/foxglove-assets/models/nathan-walking.glb`,
          media_type: "model/gltf",
          override_color: false,
          data: new Uint8Array(),
          animation: {
            name: "Take 001",
            loop: true,
            speed: agentState.social_state.toLocaleLowerCase() === "running" ? 1.0 : 0.7, // <- animation speed
          },
        };
    ```

2. ***wallsConverter.ts*** (located in `packages/studio-base/src/extensions/arena/wallsConverter.ts`): This extension converts the ROS topic `/pedsim_msgs/Walls` into the format understandable by the Foxglove [SceneEntity CubePrimitive[]](https://docs.foxglove.dev/docs/visualization/message-schemas/scene-entity/). The Foxglove uses this format to visualize the walls in the simulation.

3. ***Arena Running Instances*** (located in `packages/studio-base/src/components/DataSourceDialog/Start.tsx`): The running instances of the Arena-Rosnav are listed here in the Foxglove Interface. The user can select the running instance to visualize the simulation in the Foxglove.
    - This customization allows the user to connect to the running instance of the Arena-Rosnav and configure the Foxglove based on the running instance and the robot's configuration.
    - All configurations are preconfigured and stored in the Arena-Frontend Repository.
    - More infomation about the configurations can be found in the [Foxglove Documentation](https://docs.foxglove.dev/docs/visualization/introduction).


## Integration of Foxglove into Arena-Rosnav
The Foxglove is integrated into the Arena-Rosnav using an Iframe. The Iframe is embedded into the Arena-Frontend and the Foxglove is served as an isolated application. Arena-Frontend loads all necessary compiled JavaScript and CSS files from the Foxglove and renders the Foxglove in the Iframe. Also some modifications are made to improve the user experience by adding Fullscreen mode which allows the user to visualize the simulation in bigger frame.
