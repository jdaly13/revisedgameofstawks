import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';

var HomePage = function() {
  return (
    <Card className={['container', 'maincards'].join(' ')}>
      <CardTitle title="GAME OF STAWKS" subtitle="This is the home page." />
    </Card>
  );
};

export default HomePage;
