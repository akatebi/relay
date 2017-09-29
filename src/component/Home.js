import React from 'react';


const Home = () => (
  <div className="col-sm-offset-0 col-sm-5" style={{ textAlign: 'center' }}>
    <br />
    <br />
    <div className="highlight-xl">{`Linqoln ${process.env.GIT_BRANCH}`}</div>
    {process.env.GIT_LOG.split('\n').slice(0, 3).reverse().map(x => (
      <div key={x}>
        <hr />
        <div className="highlight-md">{x}</div>
      </div>
    ))}
    <hr />
  </div>
);

export default Home;
