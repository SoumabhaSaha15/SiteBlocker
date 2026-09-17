import { getRuleList } from "@/utils/rules";
import { type RulesType, } from "@/validator/rules";
import { IBlockResolver, BlockContext, type ResolvedResult, type StaticCreate } from "@/types/interfaces";

class RuleResolver implements IBlockResolver {
  name = 'RuleResolver';
  #rules: RulesType[]
  private constructor(rules: RulesType[]) {
    this.#rules = rules;
  }
  static async create(): Promise<IBlockResolver> {
    const list = await getRuleList();
    return new RuleResolver(list);
  }

  resolve({ url }: BlockContext): ResolvedResult {
    const rule = this.#rules.find((value) => value.site === url.origin);
    if (!rule) return { blocked: false };
    const blockedKeys = new Set(rule.blockedKeys), search = new Set(url.searchParams.values().map(v => v.toLocaleLowerCase()));
    const matchFound = !search.isDisjointFrom(blockedKeys);
    return (matchFound === rule.blocked) ? ({ blocked: true, reason: 'RULE', matchedPattern: url.hostname }) : ({ blocked: false });
  }
}

RuleResolver satisfies StaticCreate;

export default RuleResolver;
