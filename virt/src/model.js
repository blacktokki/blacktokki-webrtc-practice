const {
    Application,
    live2d: { Live2DModel },
} = PIXI;

// Kalidokit provides a simple easing function
// (linear interpolation) used for animation smoothness
// you can use a more advanced easing function if you want
const {
    Face,
    Vector: { lerp },
    Utils: { clamp },
} = Kalidokit;

const params = {
    lerpAmount: 0.6,//반응속도
    bodyDampener:0.3,
}

// motion parameters
const PARAM_NAMES = [
    "PARAM_EYE_BALL_X",
    "PARAM_EYE_BALL_Y",
    "PARAM_ANGLE_X",
    "PARAM_ANGLE_Y",
    "PARAM_ANGLE_Z",
    "PARAM_BODY_ANGLE_X",
    "PARAM_BODY_ANGLE_Y",
    "PARAM_BODY_ANGLE_Z",
    "PARAM_MOUTH_OPEN_Y",
    "PARAM_EYE_L_OPEN",
    "PARAM_EYE_R_OPEN",
    "PARAM_MOUTH_FORM"
]
let motion_param_case = 0
const motion_params = {}

let currentModel, facemesh;

const videoElement = document.querySelector(".input_video"),
guideCanvas = document.querySelector("canvas.guides");

const onResults = (results) => {
    drawResults(results.multiFaceLandmarks[0]);
    animateLive2DModel(results.multiFaceLandmarks[0]);
};

// draw connectors and landmarks on output canvas
const drawResults = (points) => {
    if (!guideCanvas || !videoElement || !points) return;
    guideCanvas.width = videoElement.videoWidth;
    guideCanvas.height = videoElement.videoHeight;
    let canvasCtx = guideCanvas.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
    // Use `Mediapipe` drawing functions
    drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
    });
    if (points && points.length === 478) {
        //draw pupils
        drawLandmarks(canvasCtx, [points[468], points[468 + 5]], {
            color: "#ffe603",
            lineWidth: 2,
        });
    }
};

const animateLive2DModel = (points) => {
    if (!currentModel || !points) return;

    let riggedFace;

    if (points) {
        // use kalidokit face solver
        riggedFace = Face.solve(points, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigFace(riggedFace, params.lerpAmount);
    }
};

// update live2d model internal state
const rigFace = (result, lerpAmount = 0.7) => {
    if (!currentModel || !result) return;
    const coreModel = currentModel.internalModel.coreModel;
  
    currentModel.internalModel.motionManager.update = (...args) => {
        // disable default blink animation
        currentModel.internalModel.eyeBlink = undefined;

        coreModel.setParameterValueById(
            motion_params.PARAM_EYE_BALL_X,
            lerp(result.pupil.x, coreModel.getParameterValueById(motion_params.PARAM_EYE_BALL_X), lerpAmount)
        );
        coreModel.setParameterValueById(
            motion_params.PARAM_EYE_BALL_Y,
            lerp(result.pupil.y, coreModel.getParameterValueById(motion_params.PARAM_EYE_BALL_Y), lerpAmount)
        );

        // X and Y axis rotations are swapped for Live2D parameters
        // because it is a 2D system and KalidoKit is a 3D system
        coreModel.setParameterValueById(
            motion_params.PARAM_ANGLE_X,
            lerp(result.head.degrees.y, coreModel.getParameterValueById(motion_params.PARAM_ANGLE_X), lerpAmount)
        );
        coreModel.setParameterValueById(
            motion_params.PARAM_ANGLE_Y,
            lerp(result.head.degrees.x, coreModel.getParameterValueById(motion_params.PARAM_ANGLE_Y), lerpAmount)
        );
        coreModel.setParameterValueById(
            motion_params.PARAM_ANGLE_Z,
            lerp(result.head.degrees.z, coreModel.getParameterValueById(motion_params.PARAM_ANGLE_Z), lerpAmount)
        );

        // update body params for models without head/body param sync
        coreModel.setParameterValueById(
            motion_params.PARAM_BODY_ANGLE_X,
            lerp(result.head.degrees.y * params.bodyDampener, coreModel.getParameterValueById(motion_params.PARAM_BODY_ANGLE_X), lerpAmount)
        );
        coreModel.setParameterValueById(
            motion_params.PARAM_BODY_ANGLE_Y,
            lerp(result.head.degrees.x * params.bodyDampener, coreModel.getParameterValueById(motion_params.PARAM_BODY_ANGLE_Y), lerpAmount)
        );
        coreModel.setParameterValueById(
            motion_params.PARAM_BODY_ANGLE_Z,
            lerp(result.head.degrees.z * params.bodyDampener, coreModel.getParameterValueById(motion_params.PARAM_BODY_ANGLE_Z), lerpAmount)
        );

        // Simple example without winking.
        // Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
        let stabilizedEyes = Kalidokit.Face.stabilizeBlink(
            {
                l: lerp(result.eye.l, coreModel.getParameterValueById(motion_params.PARAM_EYE_L_OPEN), 0.7),
                r: lerp(result.eye.r, coreModel.getParameterValueById(motion_params.PARAM_EYE_R_OPEN), 0.7),
            },
            result.head.y,
            {
                noWink: false,
                maxRot: 1
            }
        );
        // eye blink
        coreModel.setParameterValueById(motion_params.PARAM_EYE_L_OPEN, stabilizedEyes.l);
        coreModel.setParameterValueById(motion_params.PARAM_EYE_R_OPEN, stabilizedEyes.r);

        // mouth
        coreModel.setParameterValueById(
            motion_params.PARAM_MOUTH_OPEN_Y,
            lerp(result.mouth.y, coreModel.getParameterValueById(motion_params.PARAM_MOUTH_OPEN_Y), 0.3)
        );
        // Adding 0.3 to ParamMouthForm to make default more of a "smile"
        coreModel.setParameterValueById(
            motion_params.PARAM_MOUTH_FORM,
            0.3 + lerp(result.mouth.x, coreModel.getParameterValueById(motion_params.PARAM_MOUTH_FORM), 0.3)
        );
    };
};

// create pixi application
const startModel = async(modelUrl)=>{
    const app = new PIXI.Application({
        view: document.getElementById("live2d"),
        autoStart: true,
        backgroundAlpha: 0,
        backgroundColor: 0xffffff,
        resizeTo: window,
    });

    // load live2d model
    currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
    const coreModel = currentModel.internalModel.coreModel;
    motion_param_case = PARAM_NAMES.map(v=>coreModel.getParameterValueById(v)).filter(v=>v!=0).length > 0?0:1
    PARAM_NAMES.forEach((name)=>{
        if (motion_param_case == 1){
            motion_params[name] = name.split('_').map(v=>v.toLowerCase()).map(v=>v.charAt(0).toUpperCase() + v.slice(1)).join('')
        }
        else{
            motion_params[name]=name;
        }
    })

    currentModel.scale.set(0.3 * (window.innerHeight/1080));
    currentModel.interactive = true;
    currentModel.anchor.set(0.5, 0.5);
    currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);

    // Add events to drag model
    //   currentModel.on("pointerdown", (e) => {
    //       currentModel.offsetX = e.data.global.x - currentModel.position.x;
    //       currentModel.offsetY = e.data.global.y - currentModel.position.y;
    //       currentModel.dragging = true;
    //   });
    //   currentModel.on("pointerup", (e) => {
    //       currentModel.dragging = false;
    //   });
    //   currentModel.on("pointermove", (e) => {
    //       if (currentModel.dragging) {
    //           currentModel.position.set(e.data.global.x - currentModel.offsetX, e.data.global.y - currentModel.offsetY);
    //       }
    //   });

    // Add mousewheel events to scale model
    // document.querySelector("#live2d").addEventListener("wheel", (e) => {
    //     e.preventDefault();
    //     currentModel.scale.set(clamp(currentModel.scale.x + event.deltaY * -0.001, -0.5, 10));
    // });

    // add live2d model to stage
    app.stage.addChild(currentModel);
}

// start camera using mediapipe camera utils
const startCamera = () => {
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await facemesh.send({ image: videoElement });
        },
        width: 640,
        height: 480,
    });
    camera.start();
};
;


(async function main() {  
// create media pipe facemesh instance
facemesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
});

// set facemesh config
facemesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.75,
});

// pass facemesh callback function
facemesh.onResults(onResults);
startCamera();
})();

export {
currentModel,
startModel
}