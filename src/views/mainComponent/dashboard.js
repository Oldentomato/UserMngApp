import "../../css/mainView_css.css"
import { LogoutOutlined } from "@ant-design/icons"

export default function DashBoard({isOnline, userData}){
    return(
        <>
            <main>
                <h1>대시보드</h1>

                <div className="date">
                    <input type="date" />
                </div>

                <div className="insights">
                    <div className="sales">
                        <span>
                            <LogoutOutlined />
                        </span>
                        <div className="middle">
                            <div className="left">
                                <h3>total sales</h3>
                                <h1>test</h1>
                            </div>
                            <div className="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36" />
                                </svg>
                                <div className="number">
                                    <p>80%</p>
                                </div>
                            </div>
                        </div>
                        <small className="text-muted">last 24 Hours</small>
                    </div>

                    <div className="expenses">
                        <span>
                            <LogoutOutlined />
                        </span>
                        <div className="middle">
                            <div className="left">
                                <h3>total sales</h3>
                                <h1>test</h1>
                            </div>
                            <div className="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36" />
                                </svg>
                                <div className="number">
                                    <p>80%</p>
                                </div>
                            </div>
                        </div>
                        <small className="text-muted">last 24 Hours</small>
                    </div>

                    <div className="income">
                        <span>
                            <LogoutOutlined />
                        </span>
                        <div className="middle">
                            <div className="left">
                                <h3>total sales</h3>
                                <h1>test</h1>
                            </div>
                            <div className="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36" />
                                </svg>
                                <div className="number">
                                    <p>80%</p>
                                </div>
                            </div>
                        </div>
                        <small className="text-muted">last 24 Hours</small>
                    </div>
                </div>
                <div className="recent-orders">
                    <h2>최근 고객</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>성별</th>
                                <th>번호</th>
                                <th>주소</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>test</td>
                                <td>남성</td>
                                <td>01094614120</td>
                                <td>werwerw</td>
                            </tr>
                            <tr>
                                <td>test</td>
                                <td>남성</td>
                                <td>01094614120</td>
                                <td>werwerw</td>
                            </tr>
                            <tr>
                                <td>test</td>
                                <td>남성</td>
                                <td>01094614120</td>
                                <td>werwerw</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>

            <div className="right">
                <div className="top">
                    <div>
                        <p>online</p>
                    </div>
                </div>

                <div className="recent-updates">
                    <h2>다가오는 일정</h2>
                    <div className="updates">
                        {/*  */}
                        <div className="update">
                            <div className="message">
                                <p>
                                    <b>Test</b>
                                    testetsetsetst
                                </p>
                                <small className="text-muted">
                                    2 minute ago 
                                </small>
                            </div>
                        </div>
                        {/*  */}
                        <div className="update">
                            <div className="message">
                                <p>
                                    <b>Test</b>
                                    testetsetsetst
                                </p>
                                <small className="text-muted">
                                    2 minute ago 
                                </small>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </>

    )
}