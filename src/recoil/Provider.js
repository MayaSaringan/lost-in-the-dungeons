import {
  RecoilRoot,
} from 'recoil';

const Provider = ({children})=> {

  return (
      <RecoilRoot>
        {children}
      </RecoilRoot>
  );
}

export default Provider;
