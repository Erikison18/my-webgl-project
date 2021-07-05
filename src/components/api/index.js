import React from 'react'
import "./index.css"

class App extends React.Component{
  render() {
      return <div>
          <h3>1.React 顶层 API</h3>
          <div>
            <ul>
              <li>a.组件
                <p>React.Component</p>
                <p>React.PureComponent</p>
                <p>React.memo</p>
              </li>
              <li>b.创建 React 元素
                <p>createElement()</p>
                <p>createFactory()</p>
              </li>
              <li>c.转换元素
                <p>cloneElement()</p>
                <p>isValidElement()</p>
                <p>React.Children</p>
              </li>
              <li>d.Fragments
                <p>React.Fragment</p>
              </li>
              <li>e.Refs
                <p>React.createRef</p>
                <p>React.forwardRef</p>
              </li>
              <li>f.Suspense
                <p>React.lazy</p>
                <p>React.Suspense</p>
              </li>
              <li>g.Hook
                <p>useState、useEffect、useContext</p>
                <p>useReducer
                  useCallback、
                  useMemo、
                  useRef、
                  useImperativeHandle、
                  useLayoutEffect、
                  useDebugValue
                </p>
              </li>
            </ul>
          </div>
          <h3>2.React.Component</h3>
          <div>
              <ul>
                <li>a.组件的生命周期
                  <p>挂载: constructor()、static getDerivedStateFromProps()、render()、componentDidMount()</p>
                  <p>更新：static getDerivedStateFromProps()、shouldComponentUpdate()、render()、getSnapshotBeforeUpdate()、componentDidUpdate()</p>
                  <p>卸载：componentWillUnmount()</p>
                  <p>错误处理：static getDerivedStateFromError()、componentDidCatch()</p>
                </li>
                <li>b.其他 APIs
                  <p>setState()</p>
                  <p>forceUpdate()</p>
                </li>
                <li>c.class 属性
                  <p>defaultProps</p>
                  <p>displayName</p>
                </li>
                <li>d.实例属性
                  <p>props</p>
                  <p>state</p>
                </li>
              </ul>
          </div>
          <h3>3.ReactDOM</h3>
          <div>
            <ul>
              <li>a.render()</li>
              <li>b.hydrate()</li>
              <li>c.unmountComponentAtNode()</li>
              <li>d.findDOMNode()</li>
              <li>e.createPortal()</li>
            </ul>
          </div>
          <h3>4.ReactDOMServer</h3>
          <div>
            <ul>
              <li>a.renderToString()</li>
              <li>b.renderToStaticMarkup()</li>
              <li>c.renderToNodeStream()</li>
              <li>d.renderToStaticNodeStream()</li>
            </ul>
          </div>
          <h3>5.DOM 元素</h3>
          <div>
            <ul>
                <li>a.属性差异
                  <p>checked、className、dangerouslySetInnerHTML、htmlFor、onChange、selected、style、suppressContentEditableWarning、suppressHydrationWarning、value</p>
                </li>
                <li>b.All Supported HTML Attributes
                  <p>任何标准的或自定义的 DOM 属性都是完全支持的。</p>
                </li>
            </ul>
            <h3>6.合成事件</h3>
            <div>
              <ul>
                <li>a.剪贴板事件
                  <p>onCopy、 onCut、 onPaste</p>
                </li>
                <li>b.复合事件
                  <p>onCompositionEnd、 onCompositionStart、 onCompositionUpdate</p>
                </li>
                <li>c.键盘事件
                  <p>onKeyDown、 onKeyPress、 onKeyUp</p>
                </li>
                <li>d.焦点事件
                  <p>onFocus、 onBlur</p>
                </li>
                <li>e.表单事件
                  <p>onChange、 onInput、 onInvalid、 onReset、 onSubmit </p>
                </li>
                <li>f.通用事件
                  <p>onError、 onLoad</p>
                </li>
                <li>g.Mouse Events
                  <p>onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp</p>
                </li>
                <li>h.选择事件
                  <p>onSelect</p>
                </li>
                <li>i.触摸事件
                  <p>onTouchCancel onTouchEnd onTouchMove onTouchStart</p>
                </li>
                <li>j.UI 事件
                  <p>onScroll</p>
                </li>
                <li>k.滚轮事件
                  <p>onWheel</p>
                </li>
                <li>l.媒体事件
                  <p>onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting</p>
                </li>
                <li>m.图像事件
                  <p>onLoad onError</p>
                </li>
                <li>n.动画事件
                  <p>onAnimationStart onAnimationEnd onAnimationIteration</p>
                </li>
                <li>o.过渡事件
                  <p>onTransitionEnd</p>
                </li>
                <li>p.其他事件
                  <p>nToggle</p>
                </li>
              </ul>
            </div>
            <h3>7.Test Utilities</h3>
            <div>
              搭配你所选的测试框架，轻松实现 React 组件测试
            </div>
            <h3>8.Test Renderer</h3>
            <div>
              提供了一个 React 渲染器，用于将 React 组件渲染成纯 JavaScript 对象
            </div>
            <h3>9.JavaScript 环境要求</h3>
            <div>
              React 16 依赖集合类型 Map 和 Set, 考虑在你的应用库中包含一个全局的 polyfill ，例如 core-js 或 babel-polyfill
            </div>
          </div>
        </div>
    }
}

export default App