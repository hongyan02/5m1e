import { useState, useEffect, useCallback } from 'react';

const useSvgInteraction = (onRectClick) => {
  const [selectedRect, setSelectedRect] = useState(null);
  const [svgDoc, setSvgDoc] = useState(null);

  // 创建透明覆盖层，阻止全局点击事件
  const createOverlay = useCallback((doc, svg) => {
    try {
      const overlay = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
      overlay.setAttribute("width", "100%");
      overlay.setAttribute("height", "100%");
      overlay.setAttribute("fill", "transparent");
      overlay.setAttribute("pointer-events", "all");
      overlay.setAttribute("style", "position:absolute;top:0;left:0;z-index:999;");
      
      if (svg.firstChild) {
        svg.insertBefore(overlay, svg.firstChild);
      } else {
        svg.appendChild(overlay);
      }
    } catch (error) {
      console.error('创建覆盖层时出错:', error);
    }
  }, []);

  // 从矩形元素提取文本内容
  const extractTextContent = useCallback((parentG) => {
    if (!parentG) return '';
    
    try {
      // 尝试从text元素获取
      const textElement = parentG.querySelector('text');
      if (textElement) {
        return textElement.textContent || ''; // 确保返回字符串
      }
      
      // 尝试从foreignObject中获取
      const foreignObject = parentG.querySelector('foreignObject');
      if (foreignObject) {
        // 使用textContent而不是innerHTML
        return foreignObject.textContent || '';
      }
      
      return '';
    } catch (error) {
      console.error('提取文本内容时出错:', error);
      return '';
    }
  }, []);

  // 从矩形元素提取数据属性
  const extractRectData = useCallback((rect, parentG) => {
    const cellId = parentG ? parentG.getAttribute('data-cell-id') : '';
    const textContent = extractTextContent(parentG);
    
    // 只获取必要的自定义数据属性
    const processType = rect.getAttribute('data-process-type') || '';
    const tableName = rect.getAttribute('data-table-name') || '';
    
    return {
      id: rect.id || cellId || '',
      width: Number(rect.width?.baseVal?.value || 0).toFixed(2),
      height: Number(rect.height?.baseVal?.value || 0).toFixed(2),
      x: Number(rect.x?.baseVal?.value || 0).toFixed(2),
      y: Number(rect.y?.baseVal?.value || 0).toFixed(2),
      fill: rect.getAttribute('fill') || '',
      text: textContent,
      processType,
      tableName,
      attributes: Array.from(rect.attributes || []).reduce((acc, attr) => {
        if (!['id', 'width', 'height', 'x', 'y', 'fill'].includes(attr.name)) {
          acc[attr.name] = attr.value;
        }
        return acc;
      }, {})
    };
  }, [extractTextContent]);

  // 为元素添加点击事件
  const addClickHandler = useCallback((element, parentG) => {
    if (!element || element.nodeType !== 1) return; // 确保是有效的元素节点
    
    try {
      // 使用setAttribute设置样式，而不是直接操作style对象
      const currentStyle = element.getAttribute("style") || "";
      // 确保添加cursor:pointer样式，并保留原有样式
      element.setAttribute("style", `${currentStyle}position:relative;z-index:1000;cursor:pointer;`);
      element.setAttribute("pointer-events", "all");
  
      // 找到关联的矩形元素
      let rectElement = element;
      if (element.tagName.toLowerCase() !== 'rect') {
        // 如果不是矩形，尝试找到同一组内的矩形
        const closestG = parentG || element.closest('g[data-cell-id]');
        rectElement = closestG ? closestG.querySelector('rect') : null;
      }
      
      // 如果找不到矩形元素，直接返回
      if (!rectElement) return;
      
      // 保存矩形的原始样式
      const originalStyle = rectElement.getAttribute("style") || "";
      
      // 移除旧的事件监听器以防止重复绑定
      if (element._mouseenterHandler) {
        element.removeEventListener('mouseenter', element._mouseenterHandler);
      }
      if (element._mouseleaveHandler) {
        element.removeEventListener('mouseleave', element._mouseleaveHandler);
      }
      
      // 创建并存储鼠标进入事件处理函数
      const mouseenterHandler = () => {
        console.log('鼠标进入元素:', element.tagName);
        // 无论悬停在哪个元素上，都改变矩形的填充色
        rectElement.setAttribute("fill", "#4CAF50"); // 设置为绿色
        
        // 尝试多种方式修改填充色
        rectElement.style.fill = "#4CAF50";
        rectElement.setAttribute("style", `${originalStyle}fill:#D8EFD3 !important;`);
      };
      
      // 创建并存储鼠标离开事件处理函数
      const mouseleaveHandler = () => {
        console.log('鼠标离开元素:', element.tagName);
        // 恢复矩形的原始样式
        rectElement.setAttribute("style", originalStyle);
        
        // 恢复原始填充色（如果有）
        const originalFill = rectElement.getAttribute("data-original-fill");
        if (originalFill) {
          rectElement.setAttribute("fill", originalFill);
        } else {
          // 如果没有保存原始填充色，尝试移除fill属性
          rectElement.removeAttribute("fill");
        }
      };
      
      // 保存事件处理函数引用
      element._mouseenterHandler = mouseenterHandler;
      element._mouseleaveHandler = mouseleaveHandler;
      
      // 添加事件监听器
      element.addEventListener('mouseenter', mouseenterHandler);
      element.addEventListener('mouseleave', mouseleaveHandler);
      
      // 保存矩形的原始填充色（如果有）
      if (rectElement && !rectElement.hasAttribute("data-original-fill")) {
        const fill = rectElement.getAttribute("fill");
        if (fill) {
          rectElement.setAttribute("data-original-fill", fill);
        }
      }
  
      // 移除旧的点击事件监听器以防止重复绑定
      const oldClickHandler = element._clickHandler;
      if (oldClickHandler) {
        element.removeEventListener('click', oldClickHandler);
      }

      // 创建并存储新的事件处理函数
      const clickHandler = (event) => {
        event.stopPropagation();
        
        try {
          // 获取元素所在的父级g元素，可能包含data-cell-id等信息
          const closestG = parentG || element.closest('g[data-cell-id]');
          
          // 找到关联的矩形元素
          let rectElement = element;
          if (element.tagName.toLowerCase() !== 'rect') {
            // 如果点击的不是矩形，尝试找到同一组内的矩形
            rectElement = closestG ? closestG.querySelector('rect') : null;
          }
          
          // 如果找不到矩形元素，使用当前元素的数据
          const targetElement = rectElement || element;
          const rectInfo = extractRectData(targetElement, closestG);

          console.log('元素点击信息:', rectInfo);
          
          // 设置选中的矩形
          setSelectedRect(rectInfo);
          
          // 调用外部传入的点击回调函数
          if (onRectClick && typeof onRectClick === 'function') {
            onRectClick(rectInfo);
          }
        } catch (error) {
          console.error('处理SVG元素点击时出错:', error);
        }
      };
      
      element._clickHandler = clickHandler;
      element.addEventListener('click', clickHandler);
    } catch (error) {
      console.error('添加点击处理器时出错:', error);
    }
  }, [extractRectData, onRectClick]);

  // 主要的事件监听器附加函数
  const attachEventListeners = useCallback((doc) => {
    if (!doc) return;
    
    try {
      const svg = doc.querySelector('svg');
      if (!svg) return;
      
      // 创建覆盖层
      createOverlay(doc, svg);
      
      // 查找所有包含data-cell-id的g元素
      const cellGroups = doc.querySelectorAll('g[data-cell-id]');
      
      cellGroups.forEach(group => {
        // 为每个组内的矩形添加点击事件
        const rects = group.querySelectorAll('rect:not([width="100%"][height="100%"][fill="transparent"])');
        rects.forEach(rect => {
          if (rect && rect.nodeType === 1) {
            addClickHandler(rect, group);
          }
        });
        
        // 为每个组内的文本元素添加点击事件
        const texts = group.querySelectorAll('text');
        texts.forEach(text => {
          if (text && text.nodeType === 1) {
            addClickHandler(text, group);
          }
        });
        
        // 为每个组内的foreignObject中的div元素添加点击事件
        const divs = group.querySelectorAll('foreignObject div');
        divs.forEach(div => {
          if (div && div.nodeType === 1) {
            addClickHandler(div, group);
          }
        });
      });
      
      // 如果没有找到data-cell-id的组，则回退到查找所有rect元素
      if (cellGroups.length === 0) {
        const rects = doc.querySelectorAll('rect:not([width="100%"][height="100%"][fill="transparent"])');
        rects.forEach(rect => {
          if (rect && rect.nodeType === 1) {
            addClickHandler(rect);
          }
        });
      }
    } catch (error) {
      console.error('附加SVG事件监听器时出错:', error);
    }
  }, [createOverlay, addClickHandler]);

  // 当SVG文档加载或更新时重新绑定事件
  useEffect(() => {
    if (svgDoc) {
      attachEventListeners(svgDoc);
    }
    
    // 清理函数
    return () => {
      if (svgDoc) {
        // 清理所有添加的事件监听器
        const elements = svgDoc.querySelectorAll('rect, text, foreignObject div');
        elements.forEach(element => {
          if (element._clickHandler) {
            element.removeEventListener('click', element._clickHandler);
          }
          // 清理鼠标悬停和离开事件
          element.removeEventListener('mouseenter', element._mouseenterHandler);
          element.removeEventListener('mouseleave', element._mouseleaveHandler);
        });
      }
    };
  }, [svgDoc, attachEventListeners]);

  const handleSvgLoad = (e) => {
    try {
      const doc = e.target.contentDocument;
      if (doc) {
        setSvgDoc(doc);
      }
    } catch (error) {
      console.error('加载SVG文档时出错:', error);
    }
  };

  return {
    selectedRect,
    setSelectedRect,
    handleSvgLoad
  };
};

export default useSvgInteraction;