import {Component, field, defaults, List} from "xenon";
import Hits from "searchkit/src/components/search/hits/page-objects/Hits.ts";
import Searchbox from "searchkit/src/components/search/search-box/page-objects/SearchBox.ts";
import RefinementListFilter from "searchkit/src/components/search/filters/refinement-list-filter/page-objects/RefinementListFilter.ts";
import HitsStats from "searchkit/src/components/search/hits-stats/page-objects/HitsStats.ts";

class Hit extends Component {

  @field(Component, {qa:"title"})
  title:Component

}

@defaults({qa:"hits", itemQA:"hit", itemType:Hit})
class MovieHits extends List<Hit> {

}

class SearchPage extends Component {

  @field(MovieHits)
  hits:MovieHits

  @field(Searchbox)
  searchbox:Searchbox

  @field(HitsStats)
  hitStats:HitsStats

  @field(RefinementListFilter, {id:"actors"})
  actorsFilter:RefinementListFilter
}

var searchPage:SearchPage = null;

describe("example", () => {

  beforeEach(() => {
    searchPage = new SearchPage();
    browser.get("http://demo.searchkit.co");
  })

  it("should show hits", () => {
    expect(searchPage.hits.isVisible()).toBe(true);
    expect(searchPage.hits.count()).toBe(12)
  })

  it("should find matrix", () => {
    searchPage.searchbox.search("matrix")
    expect(searchPage.searchbox.loader.isNotVisible()).toBe(true);
    expect(searchPage.hits.get(0).title.getText()).toBe("The Matrix")
    expect(searchPage.hits.count()).toBe(2)
    expect(searchPage.hitStats.info.getText()).toBe("2 results found")
  })

  it("should refine actors", () => {
    expect(searchPage.actorsFilter.isVisible()).toBe(true)
    var firstOption = searchPage.actorsFilter.options.get(0);
    expect(searchPage.actorsFilter.options.count()).toBe(10)
    expect(firstOption.label.getText()).toBe("Naveen Andrews")
    firstOption.click()

    expect(searchPage.searchbox.loader.isNotVisible()).toBe(true)

    var firstHit = searchPage.hits.get(0)
    expect(firstHit.isVisible()).toBe(true)
    expect(firstHit.title.getText()).toBe("Confidence Man")

    var secondOption = searchPage.actorsFilter.options.get(1);
    expect(secondOption.label.getText()).toBe("Emilie de Ravin")
    secondOption.click()
    expect(searchPage.searchbox.loader.isNotVisible()).toBe(true)
    firstHit = searchPage.hits.get(0)
    expect(firstHit.isVisible()).toBe(true)
    expect(firstHit.title.getText()).toBe("Confidence Man")

    searchPage.actorsFilter.options.get(0).click()
    expect(searchPage.searchbox.loader.isNotVisible()).toBe(true)
    firstHit = searchPage.hits.get(0)
    expect(firstHit.title.getText()).toBe("Confidence Man")
    expect(searchPage.hitStats.info.getText()).toBe("73 results found")
  })

})
