import '../stylesheets/App.css';

import { detectHyperLinks } from '../helper';

function Description(props) {
  const regex = /\[([^\]]+)\]\( *(https?:\/\/[^\s)]*) *\)/;
  let item = detectHyperLinks(props.description);
  console.log(item);
  let result = props.description;
  item.forEach(eachMatch => {
    result = result.replace(regex, `<a href=${eachMatch.url} target="_blank">${eachMatch.linkText}</a>`);
  })
  return (
    <div dangerouslySetInnerHTML={{ __html: result }} />
  );
}

export default Description;