type PropsType = {
  top: number;
  left: number;
};
const createDot = ({ top, left }: PropsType): void => {
  const dot = document.createElement('div');
  dot.style.top = `${top}px`;
  dot.style.left = `${left}px`;
  dot.style.position = 'absolute';
  dot.style.width = '4px';
  dot.style.height = '4px';
  dot.style.borderRadius = '50%';
  dot.style.background = 'red';
  dot.classList.add('dot');
  document.body.appendChild(dot);
};

export default createDot;
