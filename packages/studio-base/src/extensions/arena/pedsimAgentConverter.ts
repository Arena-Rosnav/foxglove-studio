import { ModelPrimitive, Pose, SceneUpdate, Vector3 } from "@foxglove/schemas";
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
};

export default function arenaPedsimAgents(): RegisterMessageConverterArgs<SceneUpdate> {
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
                euler.z += Math.PI / 2;
                q.setFromEuler(euler);
                agentState.pose.orientation = {
                    x: q.x,
                    y: q.y,
                    z: q.z,
                    w: q.w,
                };
                const model: ModelPrimitive = {
                    pose: agentState.pose,
                    scale: { x: 1, y: 1, z: 1 },
                    color: { r: 1, g: 0, b: 0, a: 1 },
                    url: `${hostOrigin}/lib/foxglove-models/astronaut.glb`,
                    media_type: "model/gltf-binary",
                    override_color: false,
                    data: new Uint8Array(),
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