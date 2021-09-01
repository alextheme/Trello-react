import React from 'react';
import './home.scss';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
// RouteComponentProps
import Board from '../Board/Board';
import { IData as IBoard } from '../../common/interfaces/Interfaces';

type PropsType = {
  match: { url: string; path: string; isExact: boolean; params: any };
  location: { hash: string; key: string; pathname: string; search: string; state: any };
  history: any;
};

type StateType = { boards: IBoard[] };

class Home extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      boards: [
        { id: 1, title: 'покупки' },
        { id: 2, title: 'подготовка к свадьбе' },
        { id: 3, title: 'разработка интернет-магазина' },
        { id: 4, title: 'курс по продвижению в соцсетях' },
        { id: 5, title: 'курс фронтэнда' },
      ],
    };
  }

  render(): JSX.Element {
    console.log(this.props);
    console.log(this.state);

    const { match } = this.props;
    const { url } = match;
    const { boards } = this.state;
    const li = boards
      .map((board: { id: number; title: string }) => (
        <li className="home-boards__list-element" key={board.id}>
          <Link to={`${url}/${board.id}`}>
            <span className="boards__list-element-title">{board.title}</span>
          </Link>
        </li>
      ))
      .concat([
        <li className="home-boards__list-element btn" key="btn">
          <button>+ Создать доску</button>
        </li>,
      ]);

    return (
      <div className="home-boards">
        <div className="home-boards__wrapper">
          <Switch>
            <Route exact path={url}>
              <ul className="home-boards__list">{li}</ul>
            </Route>
            <Route path={`${url}/:board_id`}>
              <Board />
            </Route>
            <Route path="*">
              <p>Page not found (Home) </p>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
