import { NotSupported, NotImplemented } from "../utils/Errors";
import {
  EntityMap,
  LabelledLogicObject,
  LogicImplementation,
  LogicInterface,
} from "./predicate-types";

export default class ParsingTruthTable implements LogicInterface {
  private structure: LogicImplementation;
  private parse: (str: string) => LabelledLogicObject;
  private compose?: (x: LabelledLogicObject) => string;

  constructor(
    structure: LogicImplementation,
    parse: ParsingTruthTable["parse"],
    compose?: ParsingTruthTable["compose"]
  ) {
    this.structure = structure;
    this.parse = parse;
    this.compose = compose;
  }

  add(...stuff: string[]) {
    for (let something of stuff) {
      let parsed = this.parse(something);
      switch (parsed.kind) {
        case "Sentence":
          this.structure.assign(parsed.object, true);
          break;

        case "Fact":
          this.structure.addFact(parsed.object);
          break;

        case "Facts":
          this.structure.addFacts(parsed.object);
          break;

        case "Rule":
          this.structure.addRule(parsed.object);
          break;

        case "Predicate":
        case "Entity":
        case "Variable":
        case "Truth":
          throw NotSupported;

        default:
          // @ts-ignore
          throw new Error(`Unexpected logic object kind: ${parsed.kind}`);
      }
    }

    return this;
  }

  mod(...stuff: string[]): this {
    // BUG: Here somewhere
    for (let something of stuff) {
      let parsed = this.parse(something);
      switch (parsed.kind) {
        case "Sentence":
          this.structure.reassign(parsed.object, true);
          break;

        case "Fact":
          this.structure.overwriteFact(parsed.object);
          break;

        case "Facts":
          this.structure.overwriteFacts(parsed.object);
          break;

        case "Rule":
          this.structure.addRule(parsed.object);
          break;

        case "Predicate":
        case "Entity":
        case "Variable":
        case "Truth":
          throw NotSupported;

        default:
          // @ts-ignore
          throw new Error(`Unexpected logic object kind: ${parsed.kind}`);
      }
    }

    return this;
  }

  evaluate(something: string) {
    const parsed = this.parse(something);
    switch (parsed.kind) {
      case "Sentence":
        return this.structure.evaluateSentence(parsed.object);
      case "Fact":
        return (
          this.structure.evaluateSentence(parsed.object) === parsed.object.truth
        );
      case "Facts":
        return this.structure.evaluateFacts(parsed.object);
      default:
        throw new NotImplemented();
    }
  }

  query(pattern: string) {
    const parsed = this.parse(pattern);
    switch (parsed.kind) {
      case "Sentence":
        return this.structure.mappingsFromFact({
          ...parsed.object,
          truth: true,
        });
      case "Fact":
        return this.structure.mappingsFromFact(parsed.object);
      case "Facts":
        return this.structure.mappingsFromFacts(parsed.object);
      default:
        throw new NotImplemented();
    }
  }

  mapEntities(_mapping: EntityMap): typeof this {
    throw new NotImplemented();
  }
}

export class ParsingError extends Error {}
export class CompositionError extends Error {}
