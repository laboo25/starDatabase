import React, { useState, useRef } from 'react';
import { Modal, Row, Col, Slider, Button, Space } from 'antd';
import { ReloadOutlined, ZoomInOutlined, ZoomOutOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Cropper from 'react-cropper';

const ImageCropper = ({ visible, image, onCancel, onCrop, aspectRatio }) => {
  const cropperRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  const handleRotationChange = (value) => {
    setRotation(value);
    if (cropperRef.current) {
      cropperRef.current.cropper.rotateTo(value);
    }
  };

  const handleReset = () => {
    setRotation(0);
    if (cropperRef.current) {
      cropperRef.current.cropper.reset();
    }
  };

  const handleZoom = (factor) => {
    if (cropperRef.current) {
      cropperRef.current.cropper.zoom(factor);
    }
  };

  const handleSliderChange = (value) => {
    const magneticDegrees = [0, 45, 90, 135, 180, -45, -90, -135, -180];
    let closest = value;
    magneticDegrees.forEach((degree) => {
      if (Math.abs(value - degree) < 5) {
        closest = degree;
      }
    });
    handleRotationChange(closest);
  };

  const handleRotate = (angle) => {
    const newRotation = (rotation + angle) % 360;
    setRotation(newRotation);
    if (cropperRef.current) {
      cropperRef.current.cropper.rotate(angle);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob((blob) => {
        onCrop(blob);
      });
    }
  };

  return (
    <Modal open={visible} footer={null} onCancel={onCancel}>
      <Cropper
        src={image}
        style={{ height: 400, width: '100%' }}
        viewMode={1}
        guides={true} // Enable grid lines
        ref={cropperRef}
        aspectRatio={aspectRatio}
        checkCrossOrigin={false}
        autoCropArea={1}
        cropBoxResizable={true} // Allow resizing
        dragMode="move" // Allow moving the crop box
        background={false}
      />
      <Row gutter={16} justify="center" className='cropper-footer'>
        <Col span={24}>
          <Slider
            min={-180}
            max={180}
            value={rotation}
            onChange={handleSliderChange}
            guides={true}
            responsive={true}
            marks={{ 0: '0°', 45: '45°', 90: '90°', 135: '135°', 180: '180°', '-45': '-45°', '-90': '-90°', '-135': '-135°', '-180': '-180°' }}
          />
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>Reset</Button>
            <Button icon={<ZoomOutOutlined />} onClick={() => handleZoom(-0.1)}>Zoom Out</Button>
            <Button icon={<ZoomInOutlined />} onClick={() => handleZoom(0.1)}>Zoom In</Button>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button icon={<MinusOutlined />} onClick={() => handleRotate(-1)}>Rotate -1°</Button>
            <Button icon={<PlusOutlined />} onClick={() => handleRotate(1)}>Rotate +1°</Button>
          </Space>
        </Col>
        <Col>
          <Button type="primary" onClick={handleCrop} className='bg-blue-500'>Crop</Button>
        </Col>
        <Col>
          <Button onClick={onCancel}>Cancel Crop</Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ImageCropper;
