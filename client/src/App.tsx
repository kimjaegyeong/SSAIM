import React from 'react';
import './App.css'
import Button from './components/button/Button';

function App() {
  return (
    <>
      <div>
        <Button size="small" colorType="purple" onClick={() => alert('Button clicked')}>
          나의 회고
        </Button>
      </div>
      <div>
        <Button size="medium" colorType="green" onClick={() => alert('Button clicked')}>
          주간 회고 생성하기
        </Button>
      </div>
      <div>
        <Button size="large" colorType="blue"  onClick={() => alert('Button clicked')}>
          회고 작성하기
        </Button>
      </div>
    </>
  )
}

export default App
