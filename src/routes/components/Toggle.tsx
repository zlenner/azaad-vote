import clsx from 'clsx'

interface Props {
  type: 'national' | 'provincial'
  onChange: (type: 'national' | 'provincial') => void
  isDisabled?: boolean
}

export default function AssemblyToggle({ type, isDisabled, onChange }: Props) {
  const defaultClass = clsx(
    isDisabled && 'opacity-50 !cursor-not-allowed',
    'transition px-2 py-1 rounded text-gray-600'
  )
  const nonSelectedClass = 'cursor-pointer'

  const selectedClass = 'bg-emerald-100 text-emerald-700 font-bold'
  return (
    <div className="flex font-mono text-sm bg-white rounded-lg shadow border py-1.5 px-2">
      <div
        className={clsx(
          defaultClass,
          type === 'national' ? selectedClass : nonSelectedClass
        )}
        onClick={() => onChange('national')}
      >
        NATIONAL
      </div>
      <div
        onClick={() => onChange('provincial')}
        className={clsx(
          defaultClass,
          type === 'provincial' ? selectedClass : nonSelectedClass
        )}
      >
        PROVINCIAL
      </div>
    </div>
  )
}
