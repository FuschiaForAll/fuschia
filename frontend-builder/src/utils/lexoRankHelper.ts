import { LexoRank } from 'lexorank'

class LexoRankHelperClass {
  public generateNewLexoRanking() {
    return LexoRank.middle().toString()
  }

  public getRankBetweenRanks(beforeRank: string, afterRank: string) {
    const before = LexoRank.parse(beforeRank)
    const after = LexoRank.parse(afterRank)
    return before.between(after).toString()
  }

  public getRankAfterEnd(lastRank: string) {
    const last = LexoRank.parse(lastRank)
    return last.genNext().genNext().toString()
  }

  public getRankBeforeStart(firstRank: string) {
    const first = LexoRank.parse(firstRank)
    return first.genPrev().genPrev().toString()
  }

  public sortOrderAfterReorder(
    list: Array<{ layerSort: string }>,
    fromIndex: number,
    toIndex: number
  ) {
    console.log(list)
    console.log(toIndex)
    console.log(list[toIndex].layerSort)
    if (list.length === 0) {
      // adding new
      return this.generateNewLexoRanking()
    } else if (list.length - 1 === toIndex) {
      // move to end
      return this.getRankAfterEnd(list[toIndex].layerSort)
    } else if (list.length === toIndex) {
      // inserting new item to end
      return this.getRankAfterEnd(list[toIndex - 1].layerSort)
    } else if (toIndex === 0) {
      // move to start
      return this.getRankBeforeStart(list[toIndex].layerSort)
    } else if (fromIndex > toIndex) {
      // move inbetween
      const before = list[toIndex - 1]
      return this.getRankBetweenRanks(before.layerSort, list[toIndex].layerSort)
    } else if (toIndex > fromIndex) {
      const before = list[toIndex]
      return this.getRankBetweenRanks(
        before.layerSort,
        list[toIndex + 1].layerSort
      )
    }
    // leave it where it is
    return list[fromIndex].layerSort
  }
}

export const LexoRankHelper = new LexoRankHelperClass()
