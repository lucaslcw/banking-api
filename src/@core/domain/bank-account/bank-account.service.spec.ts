import { BankAccountSchema } from '../../infra/db/bank-account/bank-account.schema';
import { DataSource, Repository } from 'typeorm';
import { BankAccountTypeOrmRepository } from '../../infra/db/bank-account/bank-account.typeorm.repository';
import { BankAccountService } from './bank-account.service';
import { TransactionSchema } from '../../infra/db/transaction/transaction.schema';

describe('BankAccountService', () => {
  let dataSource: DataSource;
  let ormRepository: Repository<BankAccountSchema>;
  let repository: BankAccountTypeOrmRepository;
  let bankAccountService: BankAccountService;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [BankAccountSchema, TransactionSchema],
    });
    await dataSource.initialize();
    ormRepository = dataSource.getRepository(BankAccountSchema);
    repository = new BankAccountTypeOrmRepository(ormRepository);
    bankAccountService = new BankAccountService(repository);

    jest.spyOn(bankAccountService, 'create');
  });

  it('should create a new bank account', async () => {
    await bankAccountService.create('1111-11');
    const model = await ormRepository.findOneBy({ account_number: '1111-11' });
    expect(bankAccountService.create).toHaveBeenCalledTimes(1);
    expect(bankAccountService.create).toHaveBeenCalledWith('1111-11');
    expect(model.id).toBeDefined();
    expect(model.account_number).toBe('1111-11');
  });
});
