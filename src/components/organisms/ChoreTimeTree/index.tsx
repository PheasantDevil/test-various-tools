import React from 'react';
import './index.scss';
import IdInfo from 'components/molucules/IdInfo/IdInfo';
import ComponentFrame from 'components/molucules/CommonFrame/CommonFrame';

interface Props {
  //   componentName?: string;
}
interface States {
  //   value: string;
}

class ChoreTimeTree extends React.Component<Props, States> {
  //   constructor(props: any) {
  //     super(props);
  //     // this.state = { };
  //   }

  render(): React.ReactNode {
    return (
      <>
        <ComponentFrame viewComponent={<IdInfo />} componentName="idInfo" />
      </>
    );
  }
}

export default ChoreTimeTree;
