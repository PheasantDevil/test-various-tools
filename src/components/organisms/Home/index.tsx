import React from 'react';
import './index.scss';

interface Props {
  //   componentName?: string;
}
interface States {
  //   value: string;
}

class Home extends React.Component<Props, States> {
  //   constructor(props: any) {
  //     super(props);
  //     // this.state = { };
  //   }

  render(): React.ReactNode {
    return (
      <>
        <h1>This is top page</h1>
      </>
    );
  }
}

export default Home;
