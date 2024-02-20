/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import { Button, SafeAreaView, StatusBar } from 'react-native';

import ChangeExampleModal from './ChangeExampleModal';
import OnDeviceEvaluationsExample from './OnDeviceEvaluationsExample';
import PrecomputedEvaluationsExample from './PrecomputedEvaluationsExample';

export default function App(): React.ReactNode {
  const [sample, setSample] = useState('on-device-eval');
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ChangeExampleModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          setSample={setSample}
        />
        <Button
          title="Change Example"
          onPress={() => setIsModalVisible(true)}
        ></Button>
        {(() => {
          switch (sample) {
            case 'on-device-eval':
              return <OnDeviceEvaluationsExample />;
            case 'precomputed-eval':
              return <PrecomputedEvaluationsExample />;
            default:
              throw new Error('No such sample: ' + sample);
          }
        })()}
      </SafeAreaView>
    </>
  );
}
