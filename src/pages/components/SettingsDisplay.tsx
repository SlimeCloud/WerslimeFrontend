import { Game } from "../../types/Game.ts"
import { Request } from "../../hooks/useRest.ts"
import { ReactNode, useEffect, useState } from "react"
import { Checkbox, Tooltip } from "@nextui-org/react"
import { GameSettings } from "../../types/GameSettings.ts"

export default function SettingsDisplay({ game, disabled = false, readOnly = false, update }: { game: Game, disabled?: boolean, readOnly?: boolean, update: (req?: Request<GameSettings>) => void }) {
	return (
		<>
			<BooleanProperty
				game={ game }
				disabled={ disabled } readOnly={ readOnly } property="isPublic" update={ update }
				name={ <>Öffentlich</> }
				description={ <span className="max-w-[400px]">Die Runde wird in 'Öffentliche Runden' angezeigt und kann ohne Link betreten werden</span> }
			/>
			<BooleanProperty
				game={ game }
				disabled={ disabled } readOnly={ readOnly } property="revealDeadRoles" update={ update }
				name={ <>Tote Rollen anzeigen</> }
				description={ <>Rollen von Toten werden für alle angezeigt</> }
			/>

			<BooleanProperty
				game={ game }
				disabled={ disabled } readOnly={ readOnly } property="deadSpectators" update={ update }
				name={ <>Tote Zuschauer</> }
				description={ <>Tote können die Rollen Aller sehen</> }
			/>
			<BooleanProperty
				game={ game }
				disabled={ disabled } readOnly={ readOnly } property="revealLoverRoles" update={ update }
				name={ <>Zeige Verliebten Rolle</> }
				description={ <>Die Verliebten sehen gegenseitig ihre Rollen</> }
			/>

			<BooleanProperty
				game={ game }
				disabled={ disabled } readOnly={ readOnly } property="storyMode" update={ update }
				name={ <>Story-Mode</> }
				description={ <>Der Spiel-Leiter spielt nicht sondern ist von Beginn an Zuschauer</> }
			/>

			<BooleanProperty
				game={ game }
				disabled={ disabled } readOnly={ readOnly } property="chat" update={ update }
				name={ <>Chat</> }
				description={ <>Für die aktuelle rolle steht ein Chat bereit</> }
			/>
		</>
	)
}

export function SettingsProperty<T>({ game, property, compare = (a, b) => a === b, update, autoUpdate = true, children }: {
	game: Game,
	property: keyof GameSettings,
	compare?: (a: T, b: T) => boolean,
	update: (req?: Request<GameSettings>) => void,
	autoUpdate?: boolean,
	children: (value: T, setValue: (value: T) => void, update: (value: T) => void) => ReactNode
}) {
	const actualValue = game.settings[property] as T

	const [ value, setValue ] = useState<T>(game.settings[property] as T)

	function doUpdate(value: T) {
		update({
			data: {
				[property]: value
			}
		})
	}

	useEffect(() => {
		setValue(actualValue)
	}, [ actualValue ])

	useEffect(() => {
		if(compare(value, actualValue)) return
		if(autoUpdate) doUpdate(value)
	}, [ value ])

	return children(value, setValue, doUpdate)
}

export function BooleanProperty({ game, disabled, readOnly = false, property, update, name, description }: { game: Game, disabled: boolean, readOnly?: boolean, property: keyof GameSettings, update: (req?: Request<GameSettings>) => void, name: ReactNode, description: ReactNode }) {
	return (
		<SettingsProperty<boolean> game={ game } property={ property } update={ update }>{ (value, setValue) =>
			<Tooltip shouldFlip={ false } placement="right" content={ description }>
				<div className="w-fit">
					<Checkbox isDisabled={ disabled } isReadOnly={ readOnly } isSelected={ value } onValueChange={ setValue }>{ name }</Checkbox>
				</div>
			</Tooltip> }
		</SettingsProperty>
	)
}