/*
 * @Author: your name
 * @Date: 2019-12-23 10:31:44
 * @LastEditTime: 2019-12-27 18:13:16
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\utils\tree.js
 */
/**
 *
 */
import { objectMerge } from '@/utils'

// 递归格式化成多维数组
function listToTreeMulti(list, root = 0, pk = 'id', pid = 'pid', child = 'children', other = null) {
  const tree = []
  if (list) {
    list.forEach(item => {
      if (item[pid] === root) {
        if (other !== null) {
          item = objectMerge(item, other)
        }
        const children = listToTreeMulti(list, item[pk], pk, pid, child, other)
        if (children.length) {
          item[child] = children
        }
        tree.push(item)
      }
    })
  }
  return tree
}

function getParentsId(list, id, pk = 'id', pid = 'pid') {
  let tree = []
  if (list) {
    list.forEach(item => {
      if (item[pk] === id) {
        tree.unshift(item[pid])
        const parent = getParentsId(list, item[pid], pk, pid)
        if (parent.length) {
          tree = tree.concat(parent)
        }
      }
    })
  }
  return tree
}

// 递归修改值
function upadteArr(arr, attr, val, source) {
  if (arr) {
    arr.map(item => {
      if (item[attr] === val) {
        objectMerge(item, source)
      } else {
        upadteArr(item.children, attr, val, source)
      }
    })
  }

  return arr
}

const tree = {
  listToTreeMulti,
  getParentsId,
  upadteArr
}

export default tree

