import { useState } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const Home = () => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState(null);
  const [image, setImage] = useState(null);
  const [aspect, setAspect] = useState(16 / 9); // Default aspect ratio 16:9
  const [output, setOutput] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectImage = (file) => {
    setSrc(URL.createObjectURL(file));
  };

  const cropImageNow = () => {
    if (!image || !crop) return;

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    const ctx = canvas.getContext('2d');

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * pixelRatio,
      crop.height * pixelRatio
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setOutput(base64Image);
  };

  const onImageLoad = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
    setImage(e.currentTarget);
  };

  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    if (image) {
      onImageLoad({ currentTarget: image }); // Recalculate crop when aspect changes
    }
  };

  // Handle drag-and-drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      selectImage(file);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <h3 className='fs-3 mt-md-3 mt-lg-5'>
          Photo Crop Tool - Made With ❤️ By{' '}
          <a
            className='text-danger'
            href='https://membypoudel.com.np'
            target='_blank'
            rel='noopener noreferrer'
          >
            {' '}
            Memby Poudel{' '}
          </a>
        </h3>
        <blockquote className='text-secondary'>
          - use desktop for better compatibility
        </blockquote>

        <div className='col-12 col-lg-8'>
          {!src ? (
            <Card
              className={`h-100 d-flex justify-content-center align-items-center bg-success-subtle ${
                isDragging ? 'border-primary gelatine' : ''
              }`}
              style={{ aspectRatio: '16/9' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type='file'
                accept='image/*'
                onChange={(e) => selectImage(e.target.files[0])}
                style={{ display: 'none' }}
                id='imageInput'
              />
              <img
                height={150}
                src={require('../assets/imgs/dragphoto.png')}
                alt='drag-photo-icon'
              />
              <label htmlFor='imageInput' className='text-center'>
                <p className='fw-bold mt-3'>
                  {isDragging
                    ? 'Drop the image here!'
                    : 'Select image or drop image here'}
                </p>
              </label>
            </Card>
          ) : (
            <div>
              <ReactCrop
                crop={crop}
                aspect={aspect}
                onChange={(c) => setCrop(c)}
              >
                <img src={src} onLoad={onImageLoad} alt='img to crop' />
              </ReactCrop>
            </div>
          )}
        </div>
        <div className='col-4'>
          <Card className={src ? '' : 'h-100'}>
            <Card.Body>
              <Card.Title>Choose Aspect Ratio</Card.Title>
              <ListGroup>
                <ListGroup.Item
                  action
                  onClick={() => handleAspectChange(16 / 9)}
                >
                  16:9
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => handleAspectChange(4 / 3)}
                >
                  4:3
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => handleAspectChange(1)}>
                  1:1 (Square)
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => handleAspectChange(9 / 16)}
                >
                  9:16 (Portrait)
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => handleAspectChange(null)}>
                  Freeform
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Card.Footer className='text-center'>
              <Button onClick={cropImageNow} disabled={!image || !crop}>
                Save Image
              </Button>
              {output && (
                <div>
                  <h5 className='mt-3'>Cropped Image:</h5>
                  <img src={output} alt='Cropped' style={{ width: '100%' }} />
                </div>
              )}
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
