
import * as THREE from 'three';



export function createChairAnimation(chairGroup) {
    const times = [0, 1, 2]; // Time keyframes (seconds)

    // Position keyframes (x, y, z)
    const positionValues = [
        0, 0, -20,    
        -30, 0, 20,  
        0, 0, -20,
    ];
    const positionTrack = new THREE.VectorKeyframeTrack('.position', times, positionValues, THREE.InterpolateSmooth);

    // Rotation keyframes (x, y, z, w in quaternion)
    const startRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const midRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI * 2, 0));
    const endRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    
    const rotationValues = [
        startRotation.x, startRotation.y, startRotation.z, startRotation.w,
        midRotation.x, midRotation.y, midRotation.z, midRotation.w,
        endRotation.x, endRotation.y, endRotation.z, endRotation.w
    ];
    const rotationTrack = new THREE.QuaternionKeyframeTrack('.quaternion', times, rotationValues, THREE.InterpolateSmooth);

    // Create the animation clip
    const clip = new THREE.AnimationClip('ChairAnimation', -1, [positionTrack, rotationTrack]);

    // Create a mixer and an action
    const mixer = new THREE.AnimationMixer(chairGroup);
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat);
    action.play();

    return mixer;
}
