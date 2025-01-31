
function simpleLoad( object ) {
    
        loadedObject = object.scene;
        let scaleFactor = 0.5
        loadedObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
        console.log(loadedObject);
        roattedRoomGroup.add( loadedObject );
        

        loadedObject.traverse((child) => {

            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
            }
          });


    }

export function handleLoadError( error ) {
        console.log( 'An error happened', error );
    }