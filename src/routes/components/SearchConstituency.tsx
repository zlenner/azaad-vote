import { useMemo, useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { useNavigate } from 'react-router'
import { useData } from '../../hooks/useData'
import fuseSearch from './fuseSearch'
import { Seat } from '../../hooks/useData/useLoadData'

const SearchConstituency = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const [data] = useData()

  const searchResults = useMemo(() => {
    if (searchValue.length > 0) {
      setIsPopoverOpen(true)
      const exact = Object.values(data.seats).find((seat) => {
        const isMatchingCode =
          seat.seat.toLowerCase().replaceAll('-', '') ===
          searchValue.toLowerCase().replaceAll('-', '')
        const isMatchingNumber = parseInt(seat.seat) === parseInt(searchValue)

        return isMatchingCode || isMatchingNumber
      })

      const results: {
        item: Seat
      }[] = []
      if (exact) {
        results.push({
          item: exact
        })
      }

      results.push(
        ...fuseSearch(data.seats)
          .search(searchValue)
          .filter((result) => result.item.seat !== exact?.seat)
          .slice(0, 10)
      )

      return results
    }
  }, [searchValue])

  const navigate = useNavigate()

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom', 'left']}
      align="start"
      onClickOutside={() => setIsPopoverOpen(false)}
      containerClassName="search-popover"
      containerStyle={{
        width: 'calc(50% - 16px - 16px)',
        maxWidth: 'calc(850px - 16px - 16px)'
      }}
      content={
        <div className="flex rounded bg-white mt-3 !shadow !shadow-gray-200">
          <div className="flex flex-col w-full">
            {searchResults?.map((result) => (
              <div
                key={result.item.seat}
                className="flex font-mono py-1 hover:bg-red-50 px-2 cursor-pointer text-gray-700 hover:border-l-8 border-red-500"
                style={{}}
                onClick={() => {
                  navigate('/' + result.item.seat)
                  setIsPopoverOpen(false)
                }}
              >
                <div className="font-bold">{result.item.seat}</div>
                <div className="ml-auto">
                  {result.item.pti_data.constituency_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <input
        onInput={(e) => setSearchValue(e.currentTarget.value)}
        onFocus={() => setIsPopoverOpen(true)}
        placeholder="Search Constituency"
        value={searchValue}
        className="flex flex-1 bg-white !ring-0	!shadow !shadow-gray-200 rounded-md px-3 py-1 font-bold text-red-600 font-mono tracking-tighter !border !border-transparent active:shadow-none active:border-gray-100 transition mr-3"
      ></input>
    </Popover>
  )
}

export default SearchConstituency
