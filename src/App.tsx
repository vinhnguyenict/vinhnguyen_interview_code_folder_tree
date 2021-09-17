import React, { FC } from 'react';
import { Row, Col, Typography } from 'antd';

import {TreeFolder} from "./components";

import './App.css';

const { Title} = Typography;

const App: FC = () => (
  <Row justify="center">
    <Col span={8}>
    <Title level={3} style={{textAlign: 'center', margin: '30px 0'}}>Copy Data to Folder</Title>
    <TreeFolder/>
    </Col>
  </Row>
);

export default App;