import { ModelPrimitive, Pose, SceneEntity, SceneUpdate, Vector3 } from "@foxglove/schemas";
import { Time } from "@foxglove/schemas/schemas/typescript/Time";
import {
    RegisterMessageConverterArgs,
} from "@foxglove/studio";
import {Euler, Quaternion} from "three";

type Header = {
    seq: number;
    stamp: Time;
    frame_id: string;
};

type Twist = {
    linear: Vector3;
    angular: Vector3;
};

type AgentStates = {
    header: Header;
    agent_states: AgentState[];
};

type AgentState = {
    header: Header;
    pose: Pose;
    twist: Twist;
    direction: number;
    social_state: string;
};

type ModelPrimitiveAnimated = {
    animation: {
        name: string;
        loop: boolean;
        speed: number;
    };
} & ModelPrimitive;

type ArenaSceneEntity = {
    models: ModelPrimitive[] | ModelPrimitiveAnimated[];
} & SceneEntity;

export type ArenaSceneUpdate = {
    deletions: string[];
    entities: ArenaSceneEntity[];
} & SceneUpdate;

export default function arenaPedsimAgents(): RegisterMessageConverterArgs<ArenaSceneUpdate> {
    return {
        fromSchemaName: "pedsim_msgs/AgentStates",
        toSchemaName: "foxglove.SceneUpdate",
        converter: (
            msg: unknown
        ): SceneUpdate => {
            let inputMessage = msg as AgentStates;
            let agents = [];
            let tm = inputMessage.header.stamp;
            for (const agentState of inputMessage.agent_states) {
                let hostOrigin = window.location.origin;
                if (hostOrigin === "null" && window.location.ancestorOrigins.length > 0) {
                    hostOrigin = window.location.ancestorOrigins[0] as string;
                }

                // rotate the agent by 90 degrees around the z axis
                const quaternion = agentState.pose.orientation;
                const q = new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
                const euler = new Euler().setFromQuaternion(q);
                euler.z = agentState.direction + Math.PI / 2;
                q.setFromEuler(euler);
                agentState.pose.orientation = {
                    x: q.x,
                    y: q.y,
                    z: q.z,
                    w: q.w,
                };
                // nathan:
                // scale: { x: 0.013, y: 0.013, z: 0.013 },
                // url: `${hostOrigin}/lib/foxglove-models/nathan-walking.glb`,
                // name: "Take 001",
                // euler.z = agentState.direction + Math.PI / 2;
                
                // soldier:
                // scale: { x: 1, y: 1, z: 1 },
                // url: `${hostOrigin}/lib/foxglove-models/soldier.glb`,
                // name: "Walk",
                // euler.z = agentState.direction - Math.PI / 2;

                const model: ModelPrimitiveAnimated = {
                    pose: agentState.pose,
                    scale: { x: 0.013, y: 0.013, z: 0.013 },
                    color: { r: 1, g: 0, b: 0, a: 1 },
                    url: `${hostOrigin}/lib/foxglove-models/nathan-walking.glb`,
                    media_type: "model/gltf",
                    override_color: false,
                    data: new Uint8Array(),
                    animation: {
                        name: "Take 001",
                        loop: true,
                        speed: agentState.social_state.toLocaleLowerCase() === "running" ? 0.9 : 0.5,
                    },
                };

                agents.push(model);
            }

            const sceneUpdateMessage = {
                deletions: [],
                entities: [
                    {
                        id: "agent_state-entities",
                        timestamp: tm,
                        frame_id: inputMessage.header.frame_id,
                        lifetime: { sec: 0, nsec: 0 },
                        frame_locked: false,
                        metadata: [],
                        arrows: [],
                        cubes: [],
                        spheres: [],
                        cylinders: [],
                        lines: [],
                        triangles: [],
                        texts: [],
                        models: agents,
                    },
                ],
            };

            return sceneUpdateMessage;
        },
    }
}